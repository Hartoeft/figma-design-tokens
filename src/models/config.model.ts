import { IFormatType } from './find-tokens.model';

export interface NodesList {
  /**
   * Can be found in the url of the figma file, when you click on a node
   */
  nodeId: string;
  lookFor: 'typography' | 'colors' | 'effects';
}

export type FileExportType = 'ts' | 'js' | 'css';

export interface IConfig {
  figmaFileId: string;
  figmaTeamId: string;
  nodesList: NodesList[];

  /**
   * @description Exports a ts file with the design tokens or an css file with css variables
   * @default 'ts'
   */
  fileExportType?: FileExportType;

  /**
   * @description Add your personal figma api token or add it to an .env file
   */
  figmaApiToken?: string;

  /**
   * @description The function will receive the font size as a number and must return a string
   * @example (fontSize: number) => `${fontSize}em`
   * @returns string
   */
  customFluidFontSizeFunction?: (fontSize: number) => string;

  /**
   * @description Choose where to output design token files.
   * @default './design/tokens'
   */
  distFolder?: string;

  /**
   * @description Decides if missing tokens should be ignored or not. Defaults to showing const with value 'missing'
   * @example export const myColor = 'missing';
   */
  ignoreMissingTokens?: boolean;

  /**
   * `fileExportType` has to be `js` or `ts, if tailwind is selected.
   */
  formatAs?: 'tailwind' | 'default';

  /**
   * WIP: May change in the future
   */
  tokensOutput?: IFormatType;
}
