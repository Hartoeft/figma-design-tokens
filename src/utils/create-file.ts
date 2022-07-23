import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { CONFIG } from '..';

export const createTokenFile = async (
    content: string | Uint8Array,
    outputName: string,
    nodeId: string,
) => {
    const filePath = `${CONFIG.distFolder || 'design/tokens'}`;
    const fileName = `design-token-effects-${nodeId
        .trim()
        .replaceAll(':', '-')
        .toLowerCase()}-${outputName}`;
    const fileType = CONFIG.fileExportType || 'ts';

    try {
        if (!existsSync(filePath)) {
            mkdirSync(filePath, { recursive: true });
        }

        writeFile(`${filePath}/${fileName}.${fileType}`, content, {
            encoding: 'utf8',
            flag: 'w',
        });
    } catch (error) {
        console.error(error);
    }
};
