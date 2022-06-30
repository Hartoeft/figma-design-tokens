import { FIGMA_CONFIG } from '../config/figma-config';
import { Style } from './models/figma-styles.model';
import { FigmaDocument, IColorObj, ITypographyStyles, TypeStyle } from './models/figma.model';
import { createTokenFile } from './utils/create-file';
import { FindTokens } from './utils/find-tokens';
import { formatColorTokens, formatTypographyTokens } from './utils/format-tokens';
import { getFigmaFile, getFigmaStyles } from './utils/get-figma-data';
import { getFluidValue } from './utils/get-fluid-value';

interface NodesList {
    nodeId: string;
    lookFor: 'typography' | 'colors' | 'effects';
}

// Remember to add your figma token to an .env file
class GenerateDesignTokens {
    colorNodeDocument?: FigmaDocument;
    typographyNodeDocument?: FigmaDocument;
    styles?: Style[];

    constructor(nodesList: NodesList[]) {
        if (!process.env.FIGMA_TOKEN) {
            console.error(
                'Add your FIGMA_TOKEN to an .env file, located in the root of the project',
            );
        }

        this.init(nodesList);
    }

    init = async (nodesList: NodesList[]) => {
        try {
            this.styles = await this.getStyles();
            if (!this.styles) {
                return;
            }

            Promise.all(
                nodesList.map(async (node) => {
                    const nodeDocument = await this.getNodeDocument(node.nodeId);
                    switch (node.lookFor) {
                        case 'colors':
                            await this.generateColorTokens(nodeDocument);
                            break;
                        case 'typography':
                            await this.generateTypographyTokens(nodeDocument);
                            break;

                        default:
                            return new Promise((resolve) => resolve([]));
                    }
                }),
            );

            // try {
            // this.styles = await this.getStyles();
            // if (!this.styles) {
            //     return;
            // }

            //     const nodes = await this.getDesignNodes(nodeIds);

            //     if (!nodes?.length) {
            //         console.error('No nodes found');
            //     }

            //     this.colorNodeDocument = nodes?.[0];
            //     this.typographyNodeDocument = nodes?.[1];

            //     if (this.colorNodeDocument) {
            //         await this.generateColorTokens();
            //     }

            //     if (this.typographyNodeDocument) {
            //         await this.generateTypographyTokens();
            //     }
        } catch (error) {
            console.error('Error trying to get data from Figma api', error);
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
            console.error('Error trying to get styles from sFigma api', error);
        }
    };

    /**
     * Gets a node/frame from a figma file by an id
     */
    getDesignNodes = async (nodeIds: string[]): Promise<FigmaDocument[] | undefined> => {
        try {
            // If we end up calling to many nodes, then consider getting the intire figma file.
            // Not being used, now, since the file size is pretty large

            const nodes = await Promise.all(
                nodeIds.map(async (nodeId) => {
                    return await this.getNodeDocument(nodeId);
                }),
            );

            return nodes;
        } catch (error) {
            console.error('Error trying to get Figma nodes', error);
        }
    };

    generateColorTokens = async (nodeDocument: FigmaDocument) => {
        try {
            const token = new FindTokens();
            const colorStyles: IColorObj[] =
                this.styles
                    ?.filter((style) => style.style_type === 'FILL')
                    .map((style) => {
                        token.getColorTokens(style.node_id, nodeDocument?.children || []);
                        return <IColorObj>{
                            nodeId: style.node_id,
                            description: style.description,
                            name: style.name,
                            color: token.color || '',
                        };
                    }) || [];

            const colorTokens = formatColorTokens(colorStyles);
            await createTokenFile(colorTokens, 'design-token-color');
            console.info('Finished getting color styles!');
        } catch (error) {
            console.error('Error trying to get color styles', error);
        }

        console.info('Finished getting color styles!');
    };

    generateTypographyTokens = async (nodeDocument: FigmaDocument) => {
        try {
            const tokens = new FindTokens();
            tokens.typography;
            const typographyStyles: ITypographyStyles[] =
                this.styles
                    ?.filter((style) => style.style_type === 'TEXT')
                    .map((style) => {
                        tokens.getTypographyTokens(style.node_id, nodeDocument?.children || []);

                        return <ITypographyStyles>{
                            name: style.name || 'Missing name',
                            description: style.description || '',
                            nodeId: style.node_id,
                            cssStyle: tokens.typography
                                ? this.formatTypographyCss(tokens.typography)
                                : undefined,
                        };
                    }) || [];

            const colorTokens = formatTypographyTokens(typographyStyles);
            await createTokenFile(colorTokens, 'design-token-typography');
            console.info('Finished getting typography styles!');
        } catch (error) {
            console.error('Error trying to get typography styles', error);
        }
    };

    private getNodeDocument = async (nodeId: string) => {
        const figmaFileData = await getFigmaFile(nodeId);
        const doc = figmaFileData.nodes[nodeId].document as FigmaDocument;
        console.info(`Finished getting node id ${nodeId}`);
        return doc;
    };

    private formatTypographyCss = (typography: TypeStyle) => {
        return {
            fontFamily: typography?.fontFamily,
            fontSize: `${getFluidValue(typography?.fontSize, typography?.fontSize * 0.9)}`,
            fontWeight: typography?.fontWeight,
            letterSpacing: typography?.letterSpacing
                ? `${typography?.letterSpacing / typography?.fontSize}em`
                : 'normal',
            lineHeight: `${Math.round(typography?.lineHeightPx) / typography?.fontSize}`,
            textTransform: typography?.textCase === 'UPPER' ? 'uppercase' : 'normal',
        };
    };
}

new GenerateDesignTokens([
    { nodeId: FIGMA_CONFIG.NODE_ID_COLOR, lookFor: 'colors' },
    { nodeId: FIGMA_CONFIG.NODE_ID_TYPOGRAPHY, lookFor: 'typography' },
]);
