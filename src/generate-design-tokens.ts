import { IConfig, NodesList } from './models/config.model';
import { Style } from './models/figma-styles.model';
import { FigmaDocument, IEffect, IStyleObject, ITypographyStyles, TypeStyle } from './models/figma.model';
import { getFigmaFileByNodeId, getFigmaStyles } from './services/figma.service';
import { createTokenFile } from './utils/create-file';
import { findColorTokens, findEffectTokens, findTypographyTokens } from './utils/find-tokens';
import { colorTokenOutput, formatEffectToken, typographyTokenOutput } from './utils/format-tokens';
import { messageLog } from './utils/log-messages';

export class GenerateDesignTokens {
  private config: IConfig;
  private styles: Style[] = [];
  public get isCssOutput(): boolean {
    return this.config.fileExportType === 'css';
  }

  /**
   * Generates design token files from a Figma team library
   * @param config - Configuration object
   */
  constructor(config: IConfig) {
    this.config = config;

    if (this.config.figmaApiToken) {
      process.env.FIGMA_TOKEN = config.figmaApiToken;
    }

    if (!process.env.FIGMA_TOKEN) {
      console.error('Add your FIGMA_TOKEN to an .env file, located in the root of the project');
      return;
    } else if (Array.isArray(this.config.nodesList) && !this.config.nodesList.length) {
      console.error('Add at least one node list item');
      return;
    }

    this.init(this.config.nodesList);
  }

  private init = async (nodesList: NodesList[]) => {
    messageLog('Trying to get data from Figma api, please wait...', 'info');
    try {
      this.styles = await getFigmaStyles(this.config.figmaFileId);
      await Promise.all(
        nodesList.map(async (node) => {
          const nodeDocument = await getFigmaFileByNodeId(node.nodeId, this.config.figmaFileId);
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
              messageLog(`No match for ${node.lookFor}`, 'error');
          }
        }),
      );
      messageLog('Completed getting data from Figma api', 'success');
    } catch (error) {
      messageLog(error as string, 'error');
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
              messageLog(`Info: Color style ${style.name} is not being used in your color node in figma `, 'warning');
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
      const colorTokens = colorTokenOutput(colorStyles, this.isCssOutput);
      await createTokenFile(colorTokens, 'color', nodeDocument.id, this.config.distFolder, this.config.fileExportType);
      messageLog('Finished getting color styles!', 'info');
    } catch (error) {
      messageLog(`Error trying to get color styles error: ${error}`, 'error');
    }
  };

  private generateTypographyTokens = async (nodeDocument: FigmaDocument) => {
    try {
      const typographyStyles: ITypographyStyles[] =
        this.styles
          ?.filter((style) => style.style_type === 'TEXT')
          .map((style) => {
            const typographyValue = findTypographyTokens(style.node_id, nodeDocument?.children || []);
            const cssStyle = typographyValue ? this.formatTypography(typographyValue) : undefined;

            const typographyItem: ITypographyStyles = {
              name: style.name || 'Missing name',
              description: style.description || '',
              nodeId: style.node_id,
              cssStyle,
            };

            return typographyItem;
          }) || [];

      const colorTokens = typographyTokenOutput(typographyStyles, this.isCssOutput);
      await createTokenFile(
        colorTokens,
        'typography',
        nodeDocument.id,
        this.config.distFolder,
        this.config.fileExportType,
      );
      console.info('Finished getting typography styles!');
    } catch (error) {
      messageLog(`Error trying to get typography styles: ${error}`, 'error');
    }
  };

  private generateEffectsToken = async (nodeDocument: FigmaDocument) => {
    try {
      const effectStyles: IEffect[] = this.styles
        .filter((style) => style.style_type === 'EFFECT')
        .map((style) => {
          const effectValue = findEffectTokens(style.node_id, nodeDocument?.children);

          const effectItem: IEffect = {
            nodeId: style.node_id,
            description: style.description,
            name: style.name,
          };

          if (effectValue) {
            effectItem.effect = effectValue;
          }

          return effectItem;
        });

      const effectTokens = formatEffectToken(effectStyles, this.isCssOutput);
      await createTokenFile(
        effectTokens,
        'effects',
        nodeDocument.id,
        this.config.distFolder,
        this.config.fileExportType,
      );
      messageLog('Finished getting effect styles!', 'info');
    } catch (error) {
      messageLog(`Error trying to get color styles: ${error}`, 'error');
    }
  };

  private formatTypography = (typography: TypeStyle) => {
    return this.isCssOutput ? this.formatTypographyCss(typography) : this.formatTypographyTs(typography);
  };

  private formatTypographyCss = (typography: TypeStyle) => {
    const customSize = this.config.customFluidFontSizeFunction;
    const size = customSize ? customSize(typography?.fontSize) : `${typography?.fontSize}px`;

    return `
            font-family: '${typography.fontFamily}';
            font-size:  ${size};
            font-weight: ${typography?.fontWeight};
            letter-spacing: ${typography?.letterSpacing / typography?.fontSize}em;
            line-height: ${Math.round(typography?.lineHeightPx) / typography?.fontSize};
            text-transform: ${typography?.textCase === 'UPPER' ? 'uppercase' : 'none'};
        `;
  };

  private formatTypographyTs = (typography: TypeStyle) => {
    const customSize = this.config.customFluidFontSizeFunction;

    return {
      fontSize: customSize ? customSize(typography?.fontSize) : `${typography?.fontSize}px`,
      fontFamily: typography?.fontFamily,
      fontWeight: typography?.fontWeight,
      letterSpacing: typography?.letterSpacing ? `${typography?.letterSpacing / typography?.fontSize}em` : 'normal',
      lineHeight: `${Math.round(typography?.lineHeightPx) / typography?.fontSize}`,
      textTransform: typography?.textCase === 'UPPER' ? 'uppercase' : 'none',
    };
  };
}
