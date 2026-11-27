export interface GitHubDocSource {
  /** Id i githubDocs-collectionen (brukes av GitHubDoc-komponenten) */
  id: string;
  title: string;
  /** Repo under navikt-organisasjonen */
  repo: string;
  /** Filsti i repoet, main-branch */
  file: string;
  /** Rute på tms-docs, uten skråstrek foran/bak */
  slug: string;
  /**
   * Seksjoner der den første nummererte lista skal vises som steg, slik
   * `<Steps>` gjør på de lokale sidene. Oppgi overskriftens slug, eller
   * `"_top"` for innhold før første h2. Kildefila er uendret markdown.
   */
  steps?: string[];
}

export const GITHUB_DOCS: GitHubDocSource[] = [
  {
    id: "utkast-howto",
    title: "Utkast",
    repo: "tms-utkast",
    file: "howto.md",
    slug: "utkast",
  },
  {
    id: "varsler-start-howto",
    title: "Komme i gang",
    repo: "tms-varsel-authority",
    file: "howto.md",
    slug: "varsler/start",
    steps: ["oppsett"],
  },
  {
    id: "varsler-konsumere-howto",
    title: "Konsumere varsler",
    repo: "tms-varsel-event-gateway",
    file: "howto.md",
    slug: "varsler/konsumere",
  },
  {
    id: "varsler-migrere",
    title: "Migrere fra AVRO",
    repo: "tms-varsel-authority",
    file: "migrering.md",
    slug: "varsler/migrere",
  },
];

function repoDir(file: string): string {
  const slash = file.lastIndexOf("/");
  return slash === -1 ? "" : `/${file.slice(0, slash)}`;
}

export function sourceRawUrl(doc: GitHubDocSource): string {
  return `https://raw.githubusercontent.com/navikt/${doc.repo}/main/${doc.file}`;
}

export function sourceEditUrl(doc: GitHubDocSource): string {
  return `https://github.com/navikt/${doc.repo}/edit/main/${doc.file}`;
}

/** Base for relative lenker i kildedokumentet (til lesbar blob-visning). */
export function sourceBlobBase(doc: GitHubDocSource): string {
  return `https://github.com/navikt/${doc.repo}/blob/main${repoDir(doc.file)}`;
}

/** Base for relative bildestier i kildedokumentet (til rå innhold). */
export function sourceRawBase(doc: GitHubDocSource): string {
  return `https://raw.githubusercontent.com/navikt/${doc.repo}/main${repoDir(doc.file)}`;
}

export function docBySlug(slug: string): GitHubDocSource | undefined {
  return GITHUB_DOCS.find((doc) => doc.slug === slug);
}
