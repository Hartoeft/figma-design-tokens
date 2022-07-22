export interface NodesList {
    /**
     * NOTE: NODE_ID must be with a ":" and not special characters
     */
    nodeId: string;
    lookFor: 'typography' | 'colors' | 'effects';
}

export interface Config {
    nodesList: NodesList[];
    /**
     * Exports a ts file with the design tokens or an css file with css variables
     * Defaults to .ts
     */
    fileExportType?: 'ts' | 'css';
    figmaFileId: string;
    figmaTeamId: string;
    figmaToken?: string; // Add your personal figma api token or add it to an .env file
    /**
     * Optional: If you want to use a fluid font, you can set the container size
     */
    fluidFont?: {
        /**
         * Add the max width for your content container e.g. 1440 (px),
         * If you add a value then the font-size will be returned as a css clamp() value.
         */
        desktopContainerSize: number;
        // customFluidFunction: Function; // TODO: Add support for custom fluid function
    };
    /**
     * Choose where to output files. Defaults to ./dist
     */
    distFolder?: string;
}
