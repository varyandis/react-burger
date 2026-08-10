import react from '@vitejs/plugin-react';
import { checker } from 'vite-plugin-checker';
import readableClassnames from 'vite-plugin-readable-classnames';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    checker({
      typescript: true,
    }),
    react(),
    readableClassnames(),
    sassDts({
      enabledMode: ['development'],
      esmExport: true,
    }),
    tsconfigPaths(),
  ],
  base: '/react-burger/',
  test: {
    exclude: [...configDefaults.exclude, 'e2e/**'],
    globals: true,
    environment: 'jsdom',
    passWithNoTests: true,
    setupFiles: ['./vitest-setup.ts'],
  },
  server: {
    open: true,
  },
});
