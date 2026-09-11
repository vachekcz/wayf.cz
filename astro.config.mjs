import { defineConfig } from 'astro/config';
import sitemap from './src/integrations/sitemap';

export default defineConfig({
  site: 'https://wayf.cz',
  output: 'static',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'never',
  },
});
