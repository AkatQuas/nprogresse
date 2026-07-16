import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner = [
  '/**',
  ` * NProgressE version ${pkg.version}`,
  ` * Repository: ${pkg.repository.url}`,
  ' */',
].join('\n');

function addBanner() {
  return {
    name: 'add-banner',
    generateBundle(_: unknown, bundle: Record<string, { type: string; fileName?: string; code?: string }>) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk' && chunk.fileName?.endsWith('.js') && chunk.code) {
          chunk.code = `${banner}\n${chunk.code}`;
        }
      }
    },
  };
}

export default defineConfig({
  define: {
    __NP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    dts({
      outDir: 'dist',
      include: ['src/**/*.ts'],
      rollupTypes: true,
      beforeWriteFile: (filePath, content) => ({
        filePath,
        content: content.replace(/^import ['"].*\.less['"];\r?\n/, ''),
      }),
    }),
    addBanner(),
  ],
  css: {
    preprocessorOptions: {
      less: {},
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NProgressE',
      formats: ['umd', 'es'],
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.js'),
    },
    rollupOptions: {
      output: {
        exports: 'default',
        assetFileNames: 'style.[ext]',
      },
    },
    cssCodeSplit: false,
    minify: true,
  },
  test: {
    environment: 'happy-dom',
    include: ['test/**/*.test.js'],
    globals: true,
  },
});
