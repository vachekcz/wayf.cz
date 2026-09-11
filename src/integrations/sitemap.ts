import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { AstroIntegration } from 'astro';
import { SitemapStream } from 'sitemap';

export default function sitemap(): AstroIntegration {
  let site: string | undefined;

  return {
    name: 'wayf-sitemap',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site;
      },
      'astro:build:done': async ({ dir, pages }) => {
        if (!site) throw new Error('Sitemap generation requires the site URL');

        const urls = pages
          .filter(({ pathname }) => !/^\/?(?:404|500)(?:\/|\.html)?$/.test(pathname))
          .map(({ pathname }) => new URL(pathname, site).href);
        const entries = [...new Set(urls)].sort().map((url) => ({ url }));

        await pipeline(
          Readable.from(entries),
          new SitemapStream({ xmlns: { news: false, xhtml: false, image: false, video: false } }),
          createWriteStream(new URL('sitemap.xml', dir)),
        );
      },
    },
  };
}
