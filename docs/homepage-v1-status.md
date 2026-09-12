# Homepage v1 — stav implementace

Ověřeno 2026-09-10. Vlastník schválil merge a zveřejnění aktuální implementace
podle [zadání](web-v1.md). Kontakt zůstává skrytý; veřejný e-mail a identita
provozovatele se doplní následně.

Náhledy lokálního produkčního buildu: [desktop 1440 px](previews/desktop.png)
a [mobil 375 px](previews/mobile.png). Kontakt v těchto náhledech čeká na doplnění.

## Obsah a vzhled

- Český úvod, tři projektové karty (Bertička, Arnoldek, Why We Decide), sekce O nás a připravený kontakt.
- Finální vektorové logo, původní hvězdy, nové responzivní rozložení.
- Stránka začíná rovnou úvodem bez horní hlavičky a navigace. Logo je vpravo v úvodu.
- Projekty jsou v `src/data/projects.ts`; kontakt a provozovatel
  v `src/data/contact.ts`. Prázdný kontakt se nevykresluje ani neodkazuje.
- Metadata, canonical, SVG favicon a skutečný PNG náhled 1200 × 630 px.

## Ověření projektů

Bertička má veřejný český web. Why We Decide veřejně představuje morální dilemata
a motivační profil; karta přebírá upozornění, že web je ve výstavbě. Cílové HTTPS
adresy odpovídají. El Pip a Khakham byly na přání vlastníka zatím vyřazené.

Arnoldek přesměruje na přihlášení e-mailem. Popis plánování podle cílů a vybavení
byl ověřen také v jeho implementaci; karta na nutnost přihlášení upozorňuje.
Zpětné odkazy v jednotlivých projektech nebyly měněny.

## Lokální kontroly

- `npm run check`: bez chyb, varování a hintů.
- `npm run build` a `npm run deploy:check`: úspěšné.
- `npm run smoke -- http://127.0.0.1:8798`: HTML, CSS, logo, favicon, PNG
  odpovídají buildu a mají správné typy; neexistující cesta vrací 404.
- Chromium: šířky 375, 768 a 1440 px, standardní zobrazení, vypnutý JavaScript,
  zablokovaný externí font a zvětšení textu na 200 %.
- Klávesnice: viditelný focus a funkční odkazy na sekce.
- Omezení pohybu: hvězdy bez průběžného překreslování.

## Navazující úkoly a ověření nasazení

1. Doplnit a ověřit skutečný veřejný e-mail a přesné znění identity provozovatele.
   Potom zkontrolovat i vykreslený kontakt a `mailto:`.
2. Aktuálně schválený obsah: čeština a portfolio Bertička, Arnoldek, Why We Decide.
3. `wayf.cz` a `www.wayf.cz` spravuje Wrangler jako Workers Custom Domains.
   Oprava [#20](https://github.com/vachekcz/wayf.cz/issues/20) doplňuje chybějící
   připojení `www` a trvalé přesměrování na `https://wayf.cz` včetně cesty a query;
   ověřuje je produkční smoke. `weareyourfriends.cz` má samostatný starší web,
   o jeho roli zbývá rozhodnout.
4. Po mergi ověřit produkční GitHub Actions deploy, HTTPS a smoke nové homepage.

Lokální kontroly nepotvrzují nasazení této nové verze na produkci.
