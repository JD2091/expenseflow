/* ============================================================================
 * A resolver hook so `node --test` can run the service layer directly.
 * ----------------------------------------------------------------------------
 * `src/` is written for Vite's bundler resolution, so its relative imports
 * carry no file extension. Node's ESM loader requires one. Rather than
 * littering `src/` with `.ts` suffixes to suit a test runner, this hook does
 * what the bundler does: try `.ts`, then `.tsx`, then `/index.ts`.
 *
 * Node 24 strips the types itself (the app compiles under `erasableSyntaxOnly`,
 * so every file is type-strippable by construction).
 * ========================================================================== */

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const CANDIDATES = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

export function resolve(specifier, context, nextResolve) {
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL) {
    const resolved = fileURLToPath(new URL(specifier, context.parentURL));
    for (const ext of CANDIDATES) {
      if (existsSync(resolved + ext)) return nextResolve(specifier + ext, context);
    }
  }
  return nextResolve(specifier, context);
}
