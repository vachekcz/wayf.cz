# Práce v wayf.cz

Statický web používá Astro, TypeScript, Node 24 a npm. Technické postupy a příkazy
jsou v [README.md](./README.md), podklady v [docs/](./docs/).
Před změnou čti dotčený kód a dokumentaci. Pro aplikační změny ověř
`npm run test:ci`, `npm run check` a `npm run build`; kompletní CI navíc ověřuje
Wrangler balení a smoke. Dokumentaci měň ve stejném PR jako související kód.

## Úkoly a štítky

Práci eviduj v [Issues](https://github.com/vachekcz/wayf.cz/issues), produktový
kontext je v existující [wiki](https://github.com/vachekcz/wayf.cz/wiki).
Před založením zadání prohledej otevřené i uzavřené issues.

| Štítek | Význam |
| --- | --- |
| `task` | Konkrétní práce s ověřitelnými kritérii dokončení. |
| `bug` | Pozorovaná chyba s popisem skutečného a očekávaného chování. |
| `tracking` | Společný cíl několika samostatných podúkolů; doplňuje `task`. |
| `human-action` | Úkol vyžaduje konkrétní lidskou nebo provozní akci, například potvrzení veřejných údajů. |
| `pr-open` | Celý rozsah je implementovaný, ověřený a předaný k review v otevřeném PR; dosud není mergnutý. |

Používej jen štítky, které odpovídají skutečnému obsahu a stavu. Prioritu
neodvozuj automaticky z čísla issue. `human-action` odstraň po provedení
požadované lidské akce, i když implementace úkolu dál pokračuje.

## Dokončení práce

Práh z dev-template/github-docs: **hotovo = otevřený PR** po splnění celého
rozsahu a ověření. Rozpracovaný draft nestačí.

1. Do implementačního issue zapiš výsledek, ověření, omezení a odkaz na připravený
   PR; potom issue uzavři a přidej `pr-open`. V PR použij `Related to #N`.
   Nepoužívej automatické zavírání přes `Closes` nebo `Fixes`.
2. Částečně splněný úkol nech otevřený. Tracking uzavři až po splnění celého
   cíle a všech podúkolů; u práce napříč repozitáři ověř jejich issues a PR.
3. Po mergi odstraň `pr-open`. Při zavření PR bez merge nebo při nálezu
   chybějícího původního kritéria z review issue znovu otevři a štítek odstraň.
   U více implementačních PR nejdřív ověř všechny vazby.
4. Úkol bez PR uzavři až se skutečným výsledkem či rozhodnutím. Uzavření issue
   samo o sobě nedokládá merge nebo produkční nasazení.

Štítky se spravují při práci a review; tento projekt nemá automatizaci
jejich lifecycle. Formuláře při založení pouze přidají `task` nebo `bug`.
