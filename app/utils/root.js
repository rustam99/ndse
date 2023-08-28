import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const rootPath = join(dirname(fileURLToPath(import.meta.url)), '..');
