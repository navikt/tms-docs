# Microfrontends på Min side

## Kom i gang

Ta utgangspunkt i [template for ssr microfrontend](https://github.com/navikt/tms-microfrontend-template-ssr) og opprett et nytt repository basert på denne templaten.

### Konfigurer applikasjonen


1. **Bytt ut applikasjonsnavn i konfigurasjonsfiler**
   
   CMD + Shift + F og søk etter tms-microfrontend-template-ssr og erstatt dette med ditt applikasjonsnavn.
   
2. **Tilpass nais.yaml**
   
   Tilpass både nais/dev-gcp/nais.yaml og nais/prod-gcp/nais.yaml. Alle felter som må tilpasses har tilhørende kommentar med instruksjon i template.


3. **Tilpass innholdet i .github/workflows/deploy.yaml**

   Tilpass deploy.yaml slik kommentarene i koden instruerer. Applikasjonsnavn skal være likt navn på repository.

   Du kan vente med å kommentere inn og tilpasse stegene update-manifest-prod og deploy prod til applikasjonen er klar for prodsetting. 

4. **Etterspør tilganger**
   
   Be om tilgang til å oppdatere manifest og deploye applikasjonen til nais på slack kanalen #minside-microfrontends

5. **Deploy til produksjon**
   
   Når applikasjonen er klar for prodsetting, kan du kommentere inn update-manifest-prod og deploy-prod stegene i .github/workflows/deploy.yaml. Sørg for at de er fylt inn likt som i steg 3.


## Bruk av template

### Språk
   
   Bruk språkoppsett satt opp i template og legg språkvariablene inn i /language/text.ts


### Fallback

   Microfrontenden bør du tilby en fallback - se `src/pages/[locale]/fallback.astro`


### CSS

   For lokal css kan du bruke css moduler som vanlig. 

   For bruk av designsystemet må medfølgende css isoleres til microfrontenden. Importer derfor kun de delene av ds-css som er i bruk. Aksel har laget [et verktøy for dette](https://aksel.nav.no/grunnleggende/kode/kommandolinje#56838966b1fc) som genererer listen med imports du trenger. Legg listen med imports i /styles/aksel.css.

   CSS isolering er gjort via prefix av designsystemets klassenavn. For at dette skal fungere, må du beholde section taggen som wrapper hver page, hvor applikasjonsnavnet er brukt som klassenavn.


### Client-side interaktivitet

   Ved behov for client-side interaktivitet kan [Astros Client Islands](https://docs.astro.build/en/concepts/islands/#client-islands) tas i bruk.

   Det krever også noe mer config. For å ikke overkomplisere template har vi valgt å fjerne dette som default, kontakt oss i [#minside-microfrontends](https://nav-it.slack.com/archives/C04V21LT27P) på Slack, så bistår vi med å sette opp dette.


### Design

   Vi stiller visse [designkrav](https://aksel.nav.no/god-praksis/artikler/retningslinjer-for-design-av-mikrofrontends) til utformingen av microfrontends, for å sikre en helhetlig brukeropplevelse.
   

---


### Aktivere og deaktivere microfrontends

1. **Koble til kafka topicet**
   Abonner på [min-side-microfrontend-topicet](https://github.com/navikt/min-side-microfrontend-topic-iac). **NOTE:** `microfrontendId` skal være identisk med navnet på Github-repoet du opprettet basert på templatet tidligere i guiden.

1. **Send meldinger**
   Du kan nå sende oss Enable/Disable meldinger via Kafka for å skru aktivere/deaktivere microfrontenden for spesifikke brukere.

#### Meldingsformat

```json
// Enable
{
    "@action": "enable",
    "ident": <ident for bruker: fnr/dnr>,
    "microfrontend_id": <microfrontendId>,
    "sensitivitet": <nivå som kreves for å se innholdet i mikrofrontenden, gyldige verdier: substantial og high>,
    "@initiated_by": <ditt-team>
}
```

```json
// Disable
{
    "@action":  "disable",
    "ident": <ident for bruker: fnr/dnr>,
    "microfrontend_id": <microfrontendId>,
    "@initiated_by":<ditt-team>
}
```

:::tip
Et meldingsbygger-bibliotek finnes på [Github packages](https://github.com/navikt/tms-mikrofrontend-selector/packages/1875650)
:::

#### Hva er sensitivitet?

`sensitivitet` samsvarer med [ID-portens ACR-verdier](https://docs.digdir.no/docs/idporten/oidc/oidc_protocol_id_token#acr-values).

|     Verdi     | Når brukes den?                                  |
| :-----------: | :----------------------------------------------- |
|    `high`     | Innhold krever innlogging med idporten-loa-high. |
| `substantial` | Innhold kan vises uavhengig av innloggingsnivå.  |

Hvis feltet utelates, antar systemet `high`. Logger brukeren inn med `idporten-loa-substantial` og det finnes microfrontends som krever `idporten-loa-high`, får brukeren tilbud om «step-up»-innlogging. Se også [NAIS-dokumentasjonen om security levels](https://docs.nais.io/security/auth/idporten/#security-levels).

## Rettningslinjer

For å sikre en helhetlig brukeropplevelse på tvers av ulike type innhold på Min side, stiller vi visse krav til både innhold i- og utforming av microfrontends. Tabellen under viser en oversikt over disse rettningslinjene.

|     Tema     | Krav og resurser                                                                                                                                                                                   |
| :----------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    Språk     | Alt innhold skal finnes på bokmål, nynorsk og engelsk. Språkhåndtering er allerede rigget i templaten – se `src/language/text.ts`.                                                                 |
|    Design    | Vi stiller visse [designkrav](https://aksel.nav.no/god-praksis/artikler/retningslinjer-for-design-av-mikrofrontends) til utformingen av microfrontends, for å sikre en helhetlig brukeropplevelse. |
| Dependencies | Dersom du benytter deg av client-side React komponenter bør du være på samme Major versjon som [tms- min-side](https://github.com/navikt/tms-min-side).                                            |
|  Analytics   | Vi bruker dekoratøren sin analyticsfunksjon - se `src/pages/[locale]/index.astro`.                                                                                                                 |
|   Fallback   | Dersom microfrontenden har eksterne kall bør du tilby en fallback - se `src/pages/[locale]/fallback.astro`                                                                                         |

## Plassering på Min side

Min side består av tre soner der team kan plassere innhold:

|         Seksjon         | Formål                                                                                                                                                                                                                                                                                                 | Teknisk støtte          |
| :---------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------- |
|      Din oversikt       | Personlig status og løpende saker relatert til brukerens nåværende forhold til Nav.                                                                                                                                                                                                                    | `kafka`                 |
|       Produktkort       | Produktkort er strengt talt ikke microfrontender, men regelbaserte lenker som peker til innloggede produktsider for ett område. Vi anbefaler heller å bruke kafka, siden dette er mer treffsikkert i forhold til brukers situasjon, men hvis kafka ikke er en mulighet kan dette være ett alternativ.  | `Kafka` & `Regelbasert` |
| Kanskje aktuelt for deg | Under kanskje aktuelt for deg skal bruker få forslag til annet innhold som kan være relevant for hen, for eksempel andre stønader eller støttetjenester en bruker kan ha rett på gitt at hen har en spesifikk ytelse. Foreløbig er det kun regelbaserte mikrofrontender som vises i den her seksjonen. | `Kafka` & `Regelbasert` |

## Lurer du på noe?

Dersom du har spørsmål, kan disse stilles i [#minside-microfrontends](https://nav-it.slack.com/archives/C04V21LT27P) kanalen på slack.
