import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wayf.cz',
  output: 'static',
  build: {
    inlineStylesheets: 'never',
  },
});
