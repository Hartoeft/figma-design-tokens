export interface NodesList {
    nodeId: string;
    lookFor: 'typography' | 'colors' | 'effects';
}

export interface Config {
    nodesList: NodesList[];
    figmaFileId: string;
    figmaTeamId: string;
    figmaToken?: string; // Add your personal figma api token or add it to an .env file
}
