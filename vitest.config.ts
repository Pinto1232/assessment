import { resolve as resolvePath } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolvePath(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    reporters: process.env.GITHUB_ACTIONS
      ? ['default', 'junit', 'github-actions']
      : ['default'],
    outputFile: {
      junit: './junit.xml',
    },
    env: {
      DU_SERVICE_NAME: 'test',
    },
  },
});
