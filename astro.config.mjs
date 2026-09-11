import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wayf.cz',
  output: 'static',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'never',
  },
});
