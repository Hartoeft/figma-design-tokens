import { writeFile } from 'fs/promises';

export const createTokenFile = async (
    content: string | Uint8Array,
    outputName: string,
    nodeId: string,
    outputType: 'ts' | 'css' = 'ts',
) => {
    const fileName = `design-token-${nodeId.trim().replaceAll(':', '-').toLowerCase()}-${outputName}`;
    try {
        writeFile(`dist/${fileName}.${outputType}`, content, {
            encoding: 'utf8',
            flag: 'w',
        });
    } catch (error) {
        console.error(error);
    }
};
