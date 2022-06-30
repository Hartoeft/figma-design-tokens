import fetch from 'node-fetch';
import 'dotenv/config';
import { FIGMA_CONFIG } from '../../config/figma-config';
import { FigmaFileModel } from '../models/figma.model';
import { StylesApi } from '../models/figma-styles.model';
const FILE_ID = FIGMA_CONFIG.FIGMA_FILE_ID;

const baseFigmaUrl = async (relativeUrl: string): Promise<any> => {
    const response = await fetch(`https://api.figma.com/v1/${relativeUrl}`, {
        headers: {
            'X-FIGMA-TOKEN': process.env.FIGMA_TOKEN || FIGMA_CONFIG.FIGMA_TOKEN || '',
        },
    });
    return response.json();
};

export const getFigmaFile = (nodeId: string): Promise<FigmaFileModel> => {
    return baseFigmaUrl(`files/${FILE_ID}/nodes?ids=${nodeId}`);
};

export const getFigmaStyles = (): Promise<StylesApi> => {
    return baseFigmaUrl(`files/${FILE_ID}/styles`);
};
