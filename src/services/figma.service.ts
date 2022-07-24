import 'dotenv/config';
import fetch from 'node-fetch';
import { Style, StylesApi } from '../models/figma-styles.model';
import { FigmaDocument, FigmaFileModel } from '../models/figma.model';

const baseFigmaUrl = async (relativeUrl: string): Promise<any> => {
    const response = await fetch(`https://api.figma.com/v1/${relativeUrl}`, {
        headers: {
            'X-FIGMA-TOKEN': process.env.FIGMA_TOKEN || '',
        },
    });
    return response.json();
};

export const getFigmaFile = (figmaFileId: string): Promise<FigmaFileModel> => {
    return baseFigmaUrl(`files/${figmaFileId}`);
};

export const getFigmaFileByNodeId = async (nodeId: string, figmaFileId: string): Promise<FigmaDocument> => {
    try {
        const figmaFileData = await baseFigmaUrl(`files/${figmaFileId}/nodes?ids=${nodeId}`);
        const node = figmaFileData.nodes[nodeId];

        if (!node) {
            throw new Error("Node doesn't exist");
        }

        console.info(`Finished getting node id ${nodeId}`);
        return node.document as FigmaDocument;
    } catch (error) {
        throw new Error(`Error trying to get node id ${nodeId}: ${error}`);
    }
};

/**
 * @description Gets the defined styles from a figma team library
 */
export const getFigmaStyles = async (figmaFileId: string): Promise<Style[]> => {
    try {
        const {
            meta: { styles },
        } = (await baseFigmaUrl(`files/${figmaFileId}/styles`)) as StylesApi;
        return styles;
    } catch (error) {
        throw new Error(`Error trying to get styles. Are you sure you are using the right Figma file id: ${error}`);
    }
};
