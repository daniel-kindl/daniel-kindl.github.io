import { execSync } from 'node:child_process';
import pkg from '../../package.json';

function getCommitHash(): string | null {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

// Computed once at module load (build time), not per-page — Node caches ES modules, so every
// page importing this reuses the same result instead of re-shelling out to git.
export const buildInfo = {
  version: pkg.version,
  commit: getCommitHash(),
};
