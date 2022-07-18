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
    fluidFont?: {
        /**
         * Add the max width for your content container e.g. 1440 (px)
         */
        desktopContainerSize: number;
    }
}
