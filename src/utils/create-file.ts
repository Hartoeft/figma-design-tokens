import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { CONFIG } from '../generate-design-tokens';

export const createTokenFile = async (
    content: string | Uint8Array,
    outputName: string,
    nodeId: string,
) => {
    const filePath = `${CONFIG.distFolder || 'dist'}`;
    const fileName = `design-token-effects-${nodeId
        .trim()
        .replaceAll(':', '-')
        .toLowerCase()}-${outputName}`;

    try {
        if (!existsSync(filePath)) {
            mkdirSync(filePath, { recursive: true });
        }

        writeFile(`${filePath}/${fileName}.${CONFIG.fileExportType}`, content, {
            encoding: 'utf8',
            flag: 'w',
        });
    } catch (error) {
        console.error(error);
    }
};
