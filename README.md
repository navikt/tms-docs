# tms-docs

Dokumentasjonssiden til Team Min side: [tms-docs.nav.no](https://tms-docs.nav.no).
Bygget med [Astro](https://astro.build) og [Starlight](https://starlight.astro.build).

## Arkitektur

- Sidene i `src/content/docs/` skrives som vanlig Starlight-innhold (mdx).
- Guidene for varsler og utkast hentes fra kilderepoene
  (`tms-varsel-authority`, `tms-varsel-event-gateway`, `tms-utkast`) ved
  byggetid, via en egen content-loader (`src/content/loaders/github-docs.ts`).
  Hvilke dokumenter som hentes er definert i `src/github-docs.config.ts`.
- Innholdet fryses ved bygg. En daglig cron-trigger i deploy-workflowen bygger
  og deployer på nytt, så endringer i kilderepoene er ute innen ett døgn.
  Feiler hentingen, feiler bygget – siten beholder forrige vellykkede deploy.
- Alle dokumentasjonssider prerendres statisk; kun helsesjekk-endepunktene
  kjører på serveren.

### Skrive kilde-dokumentasjon i andre repoer

Kildedokumentene er vanlig markdown. I tillegg støttes GitHubs alert-syntaks
(`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!CAUTION]`), som rendres som
native callouts både på GitHub og her. Relative lenker og bilder skrives om til
absolutte URL-er mot kilderepoet.

En nummerert liste kan vises som steg, slik `<Steps>` gjør på de lokale sidene.
Det slås på her, ikke i kilderepoet: legg overskriftens slug – eller `"_top"`
for innhold før første `h2` – i `steps` på dokumentet i
`src/github-docs.config.ts`. Kildefila forblir vanlig markdown, så GitHub og
[tms-dokumentasjon](https://navikt.github.io/tms-dokumentasjon), som henter de
samme filene, er uberørt. Finner ikke loaderen lista, logger den en advarsel og
bygger videre. Bruk det sparsomt – bare på lister leseren faktisk skal utføre i
rekkefølge.

> **Merk:** dev-serveren gjenbruker lagret innhold og kjører ikke loaderen på
> nytt når du endrer `steps`. Stopp serveren, slett
> `node_modules/.astro/data-store.json` og start på nytt – eller kjør
> `pnpm build` – for å se endringen. Cron-bygget starter alltid tomt, så dette
> gjelder bare lokalt.

> **Merk:** Styling av hentet innhold (asides, ankerlenker) avhenger av at
> loaderen sender en virtuell filsti under `src/content/docs/` til
> `renderMarkdown` (`fileURL`). Starlight prosesserer i utgangspunktet ikke
> loader-rendret innhold – verifiser at asides fortsatt rendres ved oppgradering
> av `@astrojs/starlight`.

## Lokal utvikling

| Kommando       | Hva den gjør                     |
| :------------- | :------------------------------- |
| `pnpm install` | Installerer avhengigheter        |
| `pnpm dev`     | Dev-server på `localhost:4321`   |
| `pnpm build`   | Produksjonsbygg til `./dist/`    |
| `pnpm check`   | Typesjekk (`astro check`)        |
| `pnpm test`    | Enhetstester (vitest)            |

Bygget validerer interne lenker med `starlight-links-validator` og feiler ved
brutte lenker.

## Deploy

Push til `main` bygger og deployer til dev og prod (nais). Push til
`dev-*`-brancher deployer kun til dev. I tillegg bygger cron-triggeren daglig
kl. 05:00 UTC.

## Legge til en ny side

1. **Lokalt innhold:** legg en `.mdx`-fil i `src/content/docs/` og legg den til
   i `sidebar` i `astro.config.mjs`.
2. **Innhold fra et annet repo:** legg dokumentet til i
   `src/github-docs.config.ts`, opprett en tynn wrapper-side som bruker
   `<GitHubDoc id="..." />`, og legg ruten til i `sidebar`.
