import type { Loader } from "astro/loaders";

interface GitHubDocConfig {
  id: string;
  title: string;
  repo: string;
  path: string;
}

const GITHUB_DOCS: GitHubDocConfig[] = [
  {
    id: "utkast-howto",
    title: "Utkast",
    repo: "tms-utkast",
    path: "main/howto.md",
  },
  {
    id: "varsler-start-howto",
    title: "Komme i gang",
    repo: "tms-varsel-authority",
    path: "main/howto.md",
  },
  {
    id: "varsler-konsumere-howto",
    title: "Varsel status",
    repo: "tms-varsel-event-gateway",
    path: "main/howto.md",
  },
  {
    id: "varsler-migrere",
    title: "Migrere fra AVRO",
    repo: "tms-varsel-authority",
    path: "main/migrering.md",
  },
  {
    id: "microfrontend-csr-howto",
    title: "Microfrontend CSR",
    repo: "tms-mikrofrontend-selector",
    path: "main/howto.md",
  },
];

export function githubDocsLoader(): Loader {
  return {
    name: "github-docs-loader",
    async load(context) {
      context.store.clear();

      for (const doc of GITHUB_DOCS) {
        const sourceUrl = `https://raw.githubusercontent.com/navikt/${doc.repo}/${doc.path}`;

        let body = "";
        try {
          const response = await fetch(sourceUrl);
          if (!response.ok) {
            throw new Error(`status ${response.status}`);
          }
          body = await response.text();
        } catch (error) {
          context.logger.error(
            `Failed to fetch ${sourceUrl}: ${error instanceof Error ? error.message : String(error)}`,
          );
          body = `# ${doc.title}\n\nFailed to fetch content from ${sourceUrl}.`;
        }

        const rendered = await context.renderMarkdown(body);
        const data = await context.parseData({
          id: doc.id,
          data: {
            title: doc.title,
            repo: doc.repo,
            path: doc.path,
          },
          filePath: `github/${doc.repo}/${doc.path}`,
        });

        context.store.set({
          id: doc.id,
          data,
          body,
          rendered,
          filePath: `github/${doc.repo}/${doc.path}`,
          digest: context.generateDigest(body),
        });
      }
    },
  };
}
