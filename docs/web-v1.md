# WAYF: zadání veřejného webu v1

Stav: připraveno k implementaci, obsahové volby před spuštěním jsou uvedené níže.
Datum: 2026-09-10. Cílový termín z projektového plánu: 2026-09-17.

## Výsledek

Doplnit rozpracovaný web na `wayf.cz` o jednu kompletní homepage značky
**We Are Your Friends**. Návštěvník má během několika sekund pochopit, co WAYF
dělá, najít konkrétní projekt a otevřít jeho web. Druhou hlavní akcí je kontakt.

WAYF zastřešuje Pavlovy projekty s ambicí přinášet lidem něco užitečného.
Stránka má působit jako osobitý domov skutečných produktů. Hlavní publikum tvoří
návštěvníci z projektů, osobních doporučení a potenciální spolupracovníci.

Pracovní jazyk v1 je **čeština**, podle existujícího `lang="cs"` v layoutu.
Název značky zůstává anglicky. Texty v tomto dokumentu jsou návrhy k použití
v první implementaci; čeština ani konečný výběr portfolia dosud nejsou Pavlem potvrzené.

## Výchozí stav a hranice

Repo již obsahuje Astro, TypeScript, CSS, statický build a konfiguraci nasazení
na Cloudflare Workers Static Assets. Použít existující komponenty `Layout`,
`Starfield`, `Header` a `Footer`. Homepage `src/pages/index.astro` je zatím prázdná.
Vývojové příkazy a proces nasazení popisuje [README](../README.md).

Rozsah v1: homepage, metadata, favicon a obrázek pro sdílení. Zachovat statický
výstup. Blog, CMS, uživatelské účty, backend, formulář, analytika a další jazykové
verze nejsou součástí tohoto zadání. Pro kontakt použít odkaz na e-mail.

## Struktura stránky a návrh textů

### 1. Navigace

- Vlevo text WAYF s odkazem na `/`. Finální vektorové logo je napravo v úvodu místo původní kruhové grafiky.
- Vpravo odkazy `Projekty`, `O nás`, `Kontakt` na `#projekty`, `#o-nas`, `#kontakt`.
- Na mobilu odkazy zalomit nebo zjednodušit rozložení tak, aby zůstaly dostupné bez menu vyžadujícího JavaScript.
- U pevné navigace nastavit odsazení kotev, aby nezakrývala nadpis cílové sekce.

### 2. Úvod

**H1:** We Are Your Friends

**Hlavní sdělení:** Tvoříme užitečné projekty pro každodenní život.

**Doprovodný text:** Od jídla a pohybu po porozumění vlastnímu rozhodování.
Zkoušíme nápady, které lidem usnadňují den.

**Primární odkaz:** Prozkoumat projekty → `#projekty`.

**Sekundární odkaz:** Ozvat se → `#kontakt`.

Úvod má ponechat prostor stávajícímu hvězdnému pozadí. Text musí být čitelný
bez ohledu na polohu dekorací. Na běžném mobilu má být patrné, že pod úvodem
pokračuje obsah; nepoužívat povinnou celoobrazovkovou výšku úvodu.

### 3. Projekty

**H2:** Naše projekty

**Úvod sekce:** Různé nápady. Společná chuť dělat užitečné věci.

Výchozí pořadí a texty karet:

| Projekt | Kategorie | Popis | Odkaz |
| --- | --- | --- | --- |
| Bertička | Jídlo | Jídelníček, recepty a přehled o tom, co jíš. Pomocník pro stravování podle tvých cílů. | https://berticka.com |
| Arnoldek | Pohyb | Osobní fitness pomocník pro plánování tréninků podle tvých cílů a vybavení. | https://arnoldek.com |
| Why We Decide | Sebepoznání | Morální dilemata pro lepší pochopení vlastního rozhodování. Objev motivace, které stojí za tvými volbami. | https://whywedecide.com |

Výběr upraven na přání vlastníka: El Pip a Khakham zatím vyřazené, Why We Decide
přidaný s upozorněním „Web je ve výstavbě.“ podle stavu veřejného webu.

Každá karta obsahuje kategorii, název, popis a viditelný odkaz `Otevřít projekt`
s názvem domény. Přístupný název odkazu musí obsahovat i jméno projektu.
Odkazy otevírat ve stejné záložce. Nevkládat odkazy do jiných odkazů.

Na desktopu použít dvě karty vedle sebe, na úzkém mobilu jednu. Karty mají
rovnocennou vizuální váhu. Pro v1 stačí typografie a jednoduchý dekorativní
symbol vytvořený v CSS nebo SVG; screenshoty nejsou podmínkou spuštění.

Obsah portfolia vychází z projektového plánu a následného výběru vlastníka. Před zveřejněním ověřit zařazení,
popis a funkčnost cílových webů, zejména dostupné funkce Arnoldka. Pokud některý
projekt není připravený pro návštěvníky, vynechat jeho kartu a upravit související
text v úvodu. Nepublikovat prázdné karty ani vymyšlené statistiky, reference nebo
označení dostupnosti. Seznam kandidátů v osobních poznámkách není veřejné portfolio.

### 4. O nás

**H2:** Malé nápady. Užitečné věci.

**Text:** We Are Your Friends propojuje projekty z různých oblastí každodenního
života. Zajímá nás, co může fungovat lépe, a baví nás hledat jednoduchá řešení.
Zkoušíme, učíme se a rozvíjíme to, co lidem pomáhá.

Tři stručné hodnoty:

- **Užitečnost:** Začínáme u skutečné potřeby.
- **Zvídavost:** Dáváme prostor novým nápadům a experimentům.
- **Jednoduchost:** Hledáme nejkratší cestu k něčemu, co funguje.

V textu netvrdit, že je dokončená holdingová struktura nebo že WAYF právně vlastní
všechny uvedené projekty. Vazba na projekty musí odpovídat skutečnosti. Pavlovo
jméno, medailonek či fotografie jsou volitelné obsahové doplnění po jeho rozhodnutí.

### 5. Kontakt a patička

**H2:** Máš nápad? Ozvi se.

**Text:** Zajímá tě některý z projektů nebo vidíš prostor něco vymyslet společně?
Napiš nám.

Zobrazit skutečnou veřejnou e-mailovou adresu jako odkaz `mailto:`. Adresa zatím
není zadaná; nevymýšlet `hello@wayf.cz` ani jinou schránku. Do implementace připravit
jedno místo pro její doplnění. Bez adresy kontaktní obsah a navigační odkaz skrýt;
pro kompletní v1 je doplnění a ověření kontaktu podmínkou spuštění.

Patička zachová WAYF, plný název značky a dynamický rok. Doplnit potvrzenou veřejnou
identitu provozovatele. Neopisovat soukromé podklady z vaultu do veřejné stránky.

## Vizuální zadání

Navázat na vzhled, který už je v repu: černé pozadí, hvězdy, zelené a tyrkysové
akcenty a retro typografie. Styl rozvinout do obsahových sekcí.

- Maximální šířka hlavního obsahu přibližně 1120 px, na mobilu boční odsazení alespoň 20 px.
- Krátké výrazné nadpisy, dost prostoru mezi sekcemi a jasná hierarchie obou akcí v úvodu.
- Delší text čitelným systémovým sans-serif písmem, alespoň 18 px s řádkováním kolem 1,5. VT323 ponechat pro nadpisy a krátké štítky, pokud zůstávají dobře čitelné.
- Karty s tmavým podkladem a jemným okrajem, který oddělí obsah od hvězd. Glow používat střídmě, bez rozmazávání běžného textu.
- Hover a focus jasně zvýrazní aktivní odkaz; význam se nesmí předávat jen barvou.
- Respektovat existující omezení pohybu. Nepřidávat další souvislé animace ani pohyb potřebný k pochopení obsahu.
- Použít finální logo `public/weareyourfriends-logo-vector.svg`: tři postavy na oblouku s paprsky a nápisem WE ARE YOUR FRIENDS. Soubor je přesná kopie kanonického SVG z projektových podkladů. V pravé části úvodu se původní černá kresba zobrazuje bíle pomocí CSS filtru; zachovat proporce a čitelnost na tmavém pozadí. Na užších obrazovkách se dekorativní logo skrývá stejně jako původní kruhová grafika.

## Technické požadavky

- Hlavní obsah je ve statickém HTML a všechny odkazy fungují i bez JavaScriptu.
- Použít jediný H1, logické H2/H3, sémantické sekce, viditelný focus a odkaz pro přeskočení navigace.
- Dekorace mají být skryté před čtečkou obrazovky. Obsahové obrázky mají popis a známé rozměry.
- Zachovat funkčnost při omezení pohybu, nedostupnosti externího fontu a zvětšení textu.
- Seznam projektů držet na jednom místě jako jednoduchá data s názvem, kategorií, popisem a URL; nepřidávat CMS ani obecný systém konfigurace.
- Rozšiřovat existující Astro komponenty a CSS. Nové závislosti nejsou pro tento rozsah potřeba.
- Titulek: `WAYF | We Are Your Friends`. Meta popis: `Tvoříme užitečné projekty pro každodenní život. Objev Bertičku, Arnoldka a Why We Decide.` Při změně portfolia upravit i tento text.
- Zachovat canonical URL, doplnit Open Graph a metadata pro sdílení, skutečný obrázek náhledu 1200 × 630 px a favicon odpovídající značce. Použít absolutní produkční URL pro náhled.
- Produkční stránka musí být indexovatelná. Funkční HTTPS, hlavní doména a přesměrování variant patří do ověření nasazení podle README.

## Ověření a předání

Implementace je hotová, když:

- Homepage obsahuje všechny dohodnuté sekce, finální texty a potvrzené projekty bez placeholderů.
- Každý projektový odkaz otevře odpovídající veřejný web a kontakt používá správnou adresu.
- Na šířkách 375, 768 a 1440 px nic nepřetéká, navigace nepřekrývá obsah a karty se správně skládají.
- Stránku lze projít klávesnicí, focus je viditelný a obsah funguje bez JavaScriptu i při omezení pohybu.
- Metadata a obrázek pro sdílení odpovídají finálnímu obsahu a načítají se bez chyby.
- Projdou existující `npm run check`, `npm run build`, `npm run deploy:check` a `npm run smoke` proti běžícímu `npm run preview`.

Předání obsahuje stručný popis změn, výsledky kontrol, desktopový a mobilní náhled
a seznam případných zbývajících obsahových či provozních překážek. Produkční
ověření po nasazení zahrne HTTPS, domény a smoke proti skutečné adrese; lokální
kontroly samy o sobě neznamenají, že je web spuštěný.

## Volby potřebné před spuštěním

- Potvrdit finální české texty; aktuální portfolio tvoří Bertička, Arnoldek a Why We Decide.
- Doplnit veřejný e-mail a identitu provozovatele; případně osobní medailonek.
- Ověřit aktuální připojení `wayf.cz`, chování `www` a roli `weareyourfriends.cz`.

Tyto otevřené body nebrání přípravě stránky podle uvedených pracovních voleb.
Zpětné odkazy z jednotlivých projektů na WAYF jsou navazující úkoly v jejich
repozitářích a nejsou součástí implementace homepage v tomto repu.
