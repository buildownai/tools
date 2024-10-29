import { ensureModel } from '@buildownai/examples_ollama';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';
import { rimraf } from 'rimraf';
import { config } from './config.js';
import { summarize } from './llm.js';

console.log('Start');

try {
  // Ensure the required models are available in Ollama
  await ensureModel(config().model);

  // Cleaning the output folder
  console.log('Cleaning output folder');
  const isClean = await rimraf(config().outputDir);
  if (!isClean) {
    throw new Error('Output folder could not be cleaned');
  }
  await mkdir(config().outputDir, { recursive: true });
  console.log('✅ Cleaned output folder');

  // Start summarizer
  const files = await readdir(config().inputDir, { withFileTypes: true, recursive: true });

  for (const file of files) {
    if (file.isFile() && extname(file.name) === '.md') {
      const inFile = resolve(file.path, file.name);
      console.log(`📑 -> Reading ${inFile}`);
      const content = await readFile(inFile, 'utf-8');

      const relativePath = relative(config().inputDir, inFile);
      const outFile = resolve(config().outputDir, relativePath);

      // Ensure output directory structure is created
      await mkdir(dirname(outFile), { recursive: true });

      const summary = await summarize(content);
      await writeFile(outFile.replace('README.md', 'index.md'), summary);
      console.log(`✅ -> Created ${relativePath}`);
    }
  }

  console.log('🎉 Finish');
} catch (error) {
  console.error('❌ -> Fatal error:', error);
  process.exit(1);
}
