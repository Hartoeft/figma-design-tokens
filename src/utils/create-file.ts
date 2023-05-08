import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { FileExportType } from '../models/config.model';

export const createTokenFile = async (
  content: string | Uint8Array,
  outputName: string,
  nodeId: string,
  distFolder?: string,
  fileExportType?: FileExportType,
) => {
  const filePath = `${distFolder || 'design/tokens'}`;
  const fileName = `design-token-${outputName}-${nodeId.trim().replaceAll(':', '-').toLowerCase().trim()}`;
  const fileType = fileExportType || 'ts';

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
