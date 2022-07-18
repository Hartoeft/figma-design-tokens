import { config } from '../config/figma-config';
import { Config, NodesList } from './models/config.model';
import { Style } from './models/figma-styles.model';
import {
    FigmaDocument,
    IEffect,
    IStyleObject,
    ITypographyStyles,
    TypeStyle,
} from './models/figma.model';
import { getFigmaFileByNodeId, getFigmaStyles } from './services/figma.service';
import { createTokenFile } from './utils/create-file';
import { findColorTokens, findEffectTokens, findTypographyTokens } from './utils/find-tokens';
import { colorTokenOutput, formatEffectToken, typographyTokenOutput } from './utils/format-tokens';
import { getFluidValue } from './utils/get-fluid-value';

export let CONFIG: Config;

export class GenerateDesignTokens {
    styles: Style[] = [];

    constructor(config: Config) {
        CONFIG = config;

        if (!config.figmaToken && !process.env.FIGMA_TOKEN) {
            console.error(
                'Add your FIGMA_TOKEN to an .env file, located in the root of the project',
            );
        }

        this.init(config.nodesList);
    }

    private init = async (nodesList: NodesList[]) => {
        try {
            this.styles = await this.getStyles();

            Promise.all(
                nodesList.map(async (node) => {
                    const nodeDocument = await this.getNodeDocument(node.nodeId);
                    if (!nodeDocument) {
                        return;
                    }
                    switch (node.lookFor) {
                        case 'colors':
                            return await this.generateColorTokens(nodeDocument);
                        case 'typography':
                            return await this.generateTypographyTokens(nodeDocument);
                        case 'effects':
                            return await this.generateEffectsToken(nodeDocument);

                        default:
                            console.error(`No match for ${node.lookFor}`);
                    }
                }),
            );
            console.info('Completed getting data from Figma api');
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Gets the defined styles from a figma team library
     */
    private getStyles = async () => {
        console.info('Start getting figma styles!');
        try {
            const {
                meta: { styles },
            } = await getFigmaStyles();
            return styles;
        } catch (error) {
            throw new Error(
                `Error trying to get styles. Are you sure you are using the right Figma file id: ${error}`,
            );
        }
    };

    private generateColorTokens = async (nodeDocument: FigmaDocument) => {
        try {
            console.group('Mapping colors');
            const colorStyles: IStyleObject[] =
                this.styles
                    ?.filter((style) => style.style_type === 'FILL')
                    .map((style) => {
                        const color = findColorTokens(style.node_id, nodeDocument?.children || []);
                        if (!color) {
                            console.info(
                                `Info: Color style ${style.name} is not being used in your color node in figma `,
                            );
                        }

                        const colorItem: IStyleObject = {
                            nodeId: style.node_id,
                            description: style.description,
                            name: style.name,
                            color: color || ``,
                        };
                        return colorItem;
                    }) || [];
            console.groupEnd();
            const colorTokens = colorTokenOutput(colorStyles);
            await createTokenFile(colorTokens, 'color', nodeDocument.id, CONFIG.fileExportType);
            console.info('Finished getting color styles!');
        } catch (error) {
            console.error('Error trying to get color styles', error);
        }
    };

    private generateTypographyTokens = async (nodeDocument: FigmaDocument) => {
        try {
            const typographyStyles: ITypographyStyles[] =
                this.styles
                    ?.filter((style) => style.style_type === 'TEXT')
                    .map((style) => {
                        const typographyValue = findTypographyTokens(
                            style.node_id,
                            nodeDocument?.children || [],
                        );

                        const typographyItem: ITypographyStyles = {
                            name: style.name || 'Missing name',
                            description: style.description || '',
                            nodeId: style.node_id,
                            cssStyle: typographyValue
                                ? this.formatTypographyCss(typographyValue)
                                : undefined,
                        };

                        return typographyItem;
                    }) || [];

            const colorTokens = typographyTokenOutput(typographyStyles);
            await createTokenFile(
                colorTokens,
                'typography',
                nodeDocument.id,
                CONFIG.fileExportType,
            );
            console.info('Finished getting typography styles!');
        } catch (error) {
            console.error('Error trying to get typography styles', error);
        }
    };

    private generateEffectsToken = async (nodeDocument: FigmaDocument) => {
        try {
            const effectStyles: IEffect[] = this.styles
                .filter((style) => style.style_type === 'EFFECT')
                .map((style) => {
                    const effectValue = findEffectTokens(style.node_id, nodeDocument?.children);

                    const item: IEffect = {
                        nodeId: style.node_id,
                        description: style.description,
                        name: style.name,
                    };

                    if (effectValue) {
                        item.effect = effectValue;
                    }

                    return item;
                });

            const effectTokens = formatEffectToken(effectStyles);
            await createTokenFile(effectTokens, 'effects', nodeDocument.id);
            console.info('Finished getting effect styles!');
        } catch (error) {
            console.error('Error trying to get color styles', error);
        }
    };

    private getNodeDocument = async (nodeId: string) => {
        try {
            const figmaFileData = await getFigmaFileByNodeId(nodeId);
            const node = figmaFileData.nodes[nodeId];

            if (!node) {
                throw new Error("Node doesn't exist");
            }

            console.info(`Finished getting node id ${nodeId}`);
            return node.document as FigmaDocument;
        } catch (error) {
            console.error(`Error trying to get node id ${nodeId}`, error);
        }
    };

    private formatTypographyCss = (typography: TypeStyle) => {
        const isFluidFontSize = CONFIG.fluidFont?.desktopContainerSize;
        const isCssOutput = CONFIG.fileExportType === 'css';

        if (isCssOutput) {
            // TODO: Add support for fluid font size
            return `
                font-family: '${typography.fontFamily}';
                font-size: ${typography?.fontSize}px;
                font-weight: ${typography?.fontWeight};
                letter-spacing: ${typography?.letterSpacing / typography?.fontSize}em;
                line-height: ${Math.round(typography?.lineHeightPx) / typography?.fontSize};
                text-transform: ${typography?.textCase === 'UPPER' ? 'uppercase' : 'none'};
            `;
        } else {
            return {
                fontFamily: typography?.fontFamily,
                fontSize: isFluidFontSize
                    ? `${getFluidValue(
                          CONFIG.fluidFont!.desktopContainerSize,
                          typography?.fontSize,
                          typography?.fontSize * 0.9,
                      )}`
                    : `${typography?.fontSize}px`,
                fontWeight: typography?.fontWeight,
                letterSpacing: typography?.letterSpacing
                    ? `${typography?.letterSpacing / typography?.fontSize}em`
                    : 'normal',
                lineHeight: `${Math.round(typography?.lineHeightPx) / typography?.fontSize}`,
                textTransform: typography?.textCase === 'UPPER' ? 'uppercase' : 'none',
            };
        }
    };
}

new GenerateDesignTokens(config);
