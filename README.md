# wayf.cz

Statický web v **Astro + TypeScript + CSS**, nasazovaný na **Cloudflare Workers
Static Assets** přes GitHub Actions. Vzhled vychází z `pvachek.cz/public/aliens/`:
hvězdné pozadí a patička. Homepage představuje značku
We Are Your Friends, projekty Bertička, Arnoldek a Why We Decide a hodnoty, které je spojují.

Zadání obsahu a dokončení homepage: [Web v1](docs/web-v1.md).
Průběh ověření a zbývající body: [Stav implementace](docs/homepage-v1-status.md).

## Úkoly a review

Zadání a chyby evidujeme v [GitHub Issues](https://github.com/vachekcz/wayf.cz/issues).
Formulář **Úkol** přiřadí `task`, formulář **Bug** přiřadí `bug`.
Význam dalších štítků a dokončení práce přes připravený PR popisuje
[AGENTS.md](./AGENTS.md#úkoly-a-štítky). V PR používej `Related to #N`.
Produktové plány a souvislosti jsou ve [wiki](https://github.com/vachekcz/wayf.cz/wiki).

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
| `npm run test:ci` | Testy vyhodnocení CI reportů |
| `npm run build` | Statický build do `dist/` |
| `npm run deploy:check` | Kontrola balení pro Workers bez nasazení; vyžaduje build |
| `npm run preview` | Lokální Workers runtime na <http://localhost:8787>; vyžaduje build |
| `npm run smoke` | Porovnání servírovaného HTML a assets s buildem a ověření 404 |
| `npm run deploy` | Nasazení existujícího `dist/` na Cloudflare |
| `npm run deploy:preview -- --preview-alias pr-N` | Nahrání existujícího buildu jako preview verze bez změny produkce |
| `npm run lighthouse` | Mobilní Lighthouse měření; výchozí URL je lokální preview na portu 8787 |

Smoke můžeš nasměrovat na jinou adresu: `npm run smoke -- https://example.workers.dev`.

## Struktura

- `src/layouts/Layout.astro` — společná HTML kostra a metadata.
- `src/components/` — pozadí, projektová karta a patička.
- `src/data/projects.ts` — pořadí, texty a odkazy projektů.
- `src/data/contact.ts` — potvrzený veřejný e-mail a identita provozovatele.
- `src/pages/index.astro` — homepage; další stránky přidávej do `src/pages/`.
- `src/styles/global.css` — neonový vzhled a responzivní rozložení.
- `public/` — finální logo `weareyourfriends-logo-vector.svg`, favicon a náhled pro sdílení `og-image.png` (1200 × 630 px).
- `wrangler.jsonc` — Worker `wayf-cz`, publikuje pouze `dist/`.

Astro generuje statické HTML a malý skript hvězdného pole. Cloudflare adaptér ani
serverový Worker skript nejsou potřeba. Font VT323 se načítá lokálně ze dvou WOFF2
sad v `src/assets/fonts/`, včetně českých znaků. Latin sada se přednačítá pro hlavní
nadpis; soubory dostávají hash při buildu. Původ fontu je v `SOURCE.md`, licence
se publikuje na `/fonts/VT323-OFL.txt`. Omezení pohybu zastaví animace.

## SEO

Layout obsahuje canonical URL, metadata pro sdílení a na homepage JSON-LD `WebSite`
s názvem We Are Your Friends a alternativou WAYF. Identitu provozovatele ani
`Person` / `Organization` zatím nedoplňujeme bez potvrzených údajů — viz
[issue #5](https://github.com/vachekcz/wayf.cz/issues/5). Zpětné propojení vlastních
projektů sleduje [issue #6](https://github.com/vachekcz/wayf.cz/issues/6).

Integrace `src/integrations/sitemap.ts` při každém buildu převezme seznam vygenerovaných
stránek z Astra a pomocí knihovny `sitemap` vytvoří jediný `/sitemap.xml` se seznamem
URL. Soubor se servíruje přímo s HTTP 200, bez přesměrování nebo sitemap indexu.
Nové stránky přidávej do `src/pages/`; chybové stránky 404 a 500 integrace vynechává,
neveřejné stránky případně vyřaď ve stejném filtru. URL vycházejí ze `site`
v `astro.config.mjs`, takže preview do sitemap neposílá své adresy. Endpoint
`src/pages/robots.txt.ts` generuje povolení procházení a odkaz na `/sitemap.xml`.
Smoke ověřuje přímou odpověď i obsah XML souboru.
Cloudflare může před `robots.txt` připojit vlastní pravidla; produkční smoke proto
ověřuje neporušený konec souboru z buildu. U ostatních souborů porovnává celý obsah.

Google Search Console již spravuje majitel. Pro odeslání sitemapy použij
`https://wayf.cz/sitemap.xml`; vyhodnocení indexace a dotazů naváže na jeho data.

V Cloudflare zóně `wayf.cz` je zapnuté **Always Use HTTPS**: HTTP požadavky vrací
301 na HTTPS se zachováním cesty a parametrů. Toto nastavení je na úrovni zóny,
Wrangler ho nespravuje. Produkční smoke ověřuje i toto přesměrování.

Kontakt doplň do `src/data/contact.ts` až po potvrzení veřejné adresy a identity
provozovatele. Prázdný e-mail skryje celou kontaktní sekci
i sekundární akci v úvodu. Prázdná identita se nevypisuje v patičce.
Pro dokončení veřejné v1 jsou oba údaje podle zadání potřeba.
Při změně portfolia aktualizuj také popis v layoutu, úvodní text a obrázek pro sdílení.

## CI a nasazení

`.github/workflows/ci.yml` vychází z `dev-template/github-ci` (verze 2026-09-02):

1. Na PR i na push do `main`: `npm ci`, testy CI reportů, kontrola typů, build, Wrangler dry-run
   a smoke proti lokálnímu Workers runtime.
2. `CI Passed` vyžaduje úspěch všech kontrol. Je určený jako povinný check pro merge.
3. Pouze `main`: deploy použije přesně ověřený `dist/` artifact a následně ověří
   obsah nasazených souborů. Produkční deploye běží postupně a navzájem se neruší.

Workflow lze také ručně spustit přes GitHub Actions; nasazuje pouze při výběru
větve `main`. Na jiných větvích provede jen kontroly.

### Review appky a Lighthouse

Podle řešení z `dotidot-com` dostane PR z větve tohoto repozitáře stabilní adresu
`https://pr-N-wayf-cz.pvpvpv.workers.dev`. Každý další push aktualizuje alias `pr-N`
přes `wrangler versions upload`. Nahrává se přesně `dist/` ověřený jobem
`Check and build`; produkční deployment se nemění. Preview funguje i pro draft PR.
Fork a Dependabot PR tyto joby přeskočí.

GitHub environment `preview` obsahuje `CLOUDFLARE_API_TOKEN` a
`CLOUDFLARE_ACCOUNT_ID`. Token potřebuje Workers Scripts Edit; Cloudflare jej
neumí omezit pouze na preview upload, proto se předává pouze interním PR.
Produkční secrets zůstávají zvlášť v environmentu `production` omezeném na `main`.

Bot průběžně aktualizuje jediný PR komentář s náhledem, SHA, výsledky Lighthouse
a odkazy na celý CI běh a reporty. Komentář staršího commitu nepřepíše nový výsledek.
Neúspěšný deploy nebo chybějící měření se v komentáři výslovně označí.

Lighthouse měří homepage jednou s mobilní emulací. Informativní prahy v
`lighthouserc.cjs`: výkon 80, přístupnost 90, best practices 90, SEO 95.
Stejnou konfiguraci čte i tabulka v komentáři. Nízké skóre zobrazí varování;
neúplné měření shodí job. Preview ani Lighthouse nejsou součástí povinného
`CI Passed`, stejně jako v referenčním projektu. HTML a JSON reporty se uchovávají
jako GitHub artifact 14 dní a jsou dostupné přihlášeným uživatelům s přístupem k repu.

Lokální měření jiné adresy:

```sh
PREVIEW_URL=https://pr-3-wayf-cz.pvpvpv.workers.dev npm run lighthouse
PREVIEW_URL=https://pr-3-wayf-cz.pvpvpv.workers.dev node scripts/ci/lighthouse-summary.mjs
```

Vyžaduje nainstalovaný Chrome (na GitHub `ubuntu-latest` je připravený).
Reporty vznikají v ignorovaných adresářích `reports/` a `.lighthouseci/`.

`public/_headers` nastavuje na `workers.dev` adresách `X-Robots-Tag: noindex`;
`wayf.cz` zůstává indexovatelná. Smoke ověřuje tuto hlavičku i shodu nasazeného
obsahu s buildem, s opakováním kvůli propagaci aliasu. Lighthouse vynechává pouze
audit `is-crawlable`, který by záměrné noindex penalizoval.
Preview jsou veřejná a po zavření PR se automaticky nemažou — jde o aliasy verzí
společného Workeru, stejně jako v `dotidot-com`, nikoli samostatné aplikace.

Reference: [Cloudflare preview URL](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/),
[hlavičky statických assets](https://developers.cloudflare.com/workers/static-assets/headers/)
a [konfigurace Lighthouse CI](https://googlechrome.github.io/lighthouse-ci/docs/configuration.html).

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
