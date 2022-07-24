export interface NodesList {
    /**
     * NOTE: NODE_ID must be with a ":" and not special characters
     */
    nodeId: string;
    lookFor: 'typography' | 'colors' | 'effects';
}

export type FileExportType = 'ts' | 'css';

export interface Config {
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
    figmaToken?: string;

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
}
