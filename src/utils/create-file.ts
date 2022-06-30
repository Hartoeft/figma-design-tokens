import { writeFile } from 'fs/promises';

export const createTokenFile = async (content: string | Uint8Array, outputName: string) => {
    try {
        writeFile(`dist/${outputName}.ts`, content);
    } catch (error) {
        console.error(error);
    }
};
