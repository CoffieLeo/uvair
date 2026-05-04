import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(projectRoot, 'data', 'page.json');
const outputDir = path.join(projectRoot, 'js');
const outputPath = path.join(outputDir, 'page-data.js');
const { mkdir, readFile, writeFile } = fs.promises;

const syncPageData = async () => {
    const sourceContent = await readFile(sourcePath, 'utf8');
    const pageData = JSON.parse(sourceContent);
    const outputContent = `// Auto-generated from data/page.json.\n// Run: node scripts/sync-page-data.mjs\nwindow.__PAGE_DATA__ = ${JSON.stringify(pageData, null, 2)};\n`;

    await mkdir(outputDir, { recursive: true });
    await writeFile(outputPath, outputContent, 'utf8');

    console.log(`Synced ${path.relative(projectRoot, outputPath)} from ${path.relative(projectRoot, sourcePath)}`);
};

syncPageData().catch((error) => {
    console.error('Failed to sync page data:', error);
    process.exitCode = 1;
});
