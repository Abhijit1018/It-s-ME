/**
 * ESM-native migration runner for Payload CMS.
 * Bypasses the Payload CLI (which uses tsx CJS register, breaking on Node 22 TLA).
 * Run with: node --import tsx/esm scripts/migrate.mjs
 */
import { fileURLToPath, pathToFileURL } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = resolve(__dirname, '..', 'payload.config.ts');

// Dynamic import — ESM loader handles TLA in the dependency graph
const { default: config } = await import(pathToFileURL(configPath).href);
const { default: payload } = await import('payload');

await payload.init({
  config,
  disableDBConnect: false,
  disableOnInit: true,
});

const adapter = payload.db;
if (!adapter) throw new Error('No database adapter found');

await adapter.migrate();

console.log('Migrations complete');
process.exit(0);
