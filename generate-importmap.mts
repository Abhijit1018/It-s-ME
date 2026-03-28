/**
 * Workaround script for `payload generate:importmap` on Node.js v22 + Next.js 16.
 *
 * The standard CLI fails because @lexical packages use top-level await in their
 * .node.mjs exports, which can't be synchronously required by tsx's CJS hook.
 * Running this file via `tsx` (as .mts) forces ESM output and avoids that issue.
 *
 * Usage: npm run generate:importmap
 */
import { pathToFileURL } from 'node:url';
import path from 'path';

const cwd = process.cwd();
process.env.DISABLE_PAYLOAD_HMR = 'true';
process.argv = ['node', 'gen', 'generate:importmap'];

const { bin } = await import(pathToFileURL(path.join(cwd, 'node_modules/payload/dist/bin/index.js')).toString());
await bin();
