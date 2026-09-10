# wayf.cz

Statický web v **Astro + TypeScript + CSS**, nasazovaný na **Cloudflare Workers
Static Assets** přes GitHub Actions. Vzhled vychází z `pvachek.cz/public/aliens/`:
hvězdné pozadí s UFO, horní navigace a patička. Obsahová část je zatím prázdná.

## Lokální vývoj

Používej Node 24 (viz `.nvmrc`) a npm s verzemi závislostí z `package-lock.json`.

```sh
npm ci
npm run dev
```

Vývojový server běží na <http://localhost:4321>.

| Příkaz | Účel |
| --- | --- |
| `npm run check` | Kontrola Astro komponent a TypeScriptu |
| `npm run build` | Statický build do `dist/` |
| `npm run deploy:check` | Kontrola balení pro Workers bez nasazení; vyžaduje build |
| `npm run preview` | Lokální Workers runtime na <http://localhost:8787>; vyžaduje build |
| `npm run smoke` | Porovnání servírovaného HTML a assets s buildem a ověření 404 |
| `npm run deploy` | Nasazení existujícího `dist/` na Cloudflare |

Smoke můžeš nasměrovat na jinou adresu: `npm run smoke -- https://example.workers.dev`.

## Struktura

- `src/layouts/Layout.astro` — společná HTML kostra a metadata.
- `src/components/` — pozadí, navigace a patička.
- `src/pages/index.astro` — homepage; další stránky přidávej do `src/pages/`.
- `src/styles/global.css` — původní neonový vzhled a responzivní rozložení.
- `public/` — případné budoucí obrázky a soubory kopírované přímo do výstupu.
- `wrangler.jsonc` — Worker `wayf-cz`, publikuje pouze `dist/`.

Astro generuje statické HTML a malý skript hvězdného pole. Cloudflare adaptér ani
serverový Worker skript nejsou potřeba. Font VT323 se načítá z Google Fonts;
bez připojení se použije systémový monospace. Omezení pohybu zastaví animace.

## CI a nasazení

`.github/workflows/ci.yml` vychází z `dev-template/github-ci` (verze 2026-09-02):

1. Na PR i na push do `main`: `npm ci`, kontrola typů, build, Wrangler dry-run
   a smoke proti lokálnímu Workers runtime.
2. `CI Passed` vyžaduje úspěch všech kontrol. Je určený jako povinný check pro merge.
3. Pouze `main`: deploy použije přesně ověřený `dist/` artifact a následně ověří
   obsah nasazených souborů. Produkční deploye běží postupně a navzájem se neruší.

Workflow lze také ručně spustit přes GitHub Actions; nasazuje pouze při výběru
větve `main`. Na jiných větvích provede jen kontroly.

Pro první nasazení nastav v GitHub **Settings → Environments → production**:

| Typ | Název | Hodnota |
| --- | --- | --- |
| Secret | `CLOUDFLARE_API_TOKEN` | Deploy token omezený na cílový Cloudflare účet |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | ID cílového účtu |
| Variable | `DEPLOY_URL` | Skutečná HTTPS adresa Workeru, zpočátku `workers.dev` |

Environment `production` má povolovat deploy pouze z větve `main`. V ochraně
`main` vyžaduj PR a check `CI Passed`. Konfiguraci doplň před prvním mergem,
jinak se deploy zastaví na chybějícím nastavení. Hodnoty tokenů nepatří do repozitáře.

`wrangler.jsonc` připojuje `wayf.cz` jako Workers Custom Domain; routu spravuje
každý deploy z CI. Adresa `wayf-cz.pvpvpv.workers.dev` zůstává dostupná.
Pro veřejné směrování musí doména používat nameservery své Cloudflare zóny:
`lady.ns.cloudflare.com` a `luke.ns.cloudflare.com`. Jejich nastavení u registrátora
není součástí deploye. `DEPLOY_URL` nastav na `https://wayf.cz`, až na ní projde
smoke kontrola; do té doby ověřuje `workers.dev`. Přesměrování `www` se nastavuje
zvlášť. `site` v Astro konfiguraci určuje canonical URL; DNS nemění.

Dokumentace: [Astro](https://docs.astro.build/),
[Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/),
[GitHub Actions deploy](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).
