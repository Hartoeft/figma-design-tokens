import 'dotenv/config';
import fetch from 'node-fetch';
import { CONFIG } from '..';
import { StylesApi } from '../models/figma-styles.model';
import { FigmaFileModel } from '../models/figma.model';

const baseFigmaUrl = async (relativeUrl: string): Promise<any> => {
    const response = await fetch(`https://api.figma.com/v1/${relativeUrl}`, {
        headers: {
            'X-FIGMA-TOKEN': process.env.FIGMA_TOKEN || CONFIG?.figmaToken || '',
        },
    });
    return response.json();
};

export const getFigmaFile = (): Promise<FigmaFileModel> => {
    return baseFigmaUrl(`files/${CONFIG.figmaFileId}`);
};

export const getFigmaFileByNodeId = (nodeId: string): Promise<FigmaFileModel> => {
    return baseFigmaUrl(`files/${CONFIG.figmaFileId}/nodes?ids=${nodeId}`);
};

export const getFigmaStyles = (): Promise<StylesApi> => {
    return baseFigmaUrl(`files/${CONFIG.figmaFileId}/styles`);
};
