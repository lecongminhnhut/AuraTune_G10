import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

export async function load(url, context, nextLoad) {
  if (url.endsWith('.jsx') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.svg')) {
    if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.svg')) {
      return {
        format: 'module',
        shortCircuit: true,
        source: 'export default "mock-image.png";'
      };
    }
    const filePath = fileURLToPath(url);
    const source = fs.readFileSync(filePath, 'utf8');
    const result = esbuild.transformSync(source, {
      loader: 'jsx',
      format: 'esm',
      jsx: 'automatic',
      sourcefile: filePath
    });
    return {
      format: 'module',
      shortCircuit: true,
      source: result.code
    };
  }
  return nextLoad(url, context);
}
