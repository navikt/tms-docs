import type { Loader } from "astro/loaders";
import {
  sourceBlobBase,
  sourceRawBase,
  sourceRawUrl,
  type GitHubDocSource,
} from "../../github-docs.config";
import {
  absolutizeUrls,
  githubAlertsToDirectives,
  stripLeadingH1,
} from "./markdown-transforms";

export function githubDocsLoader({ docs }: { docs: GitHubDocSource[] }) {
  return {
    name: "github-docs-loader",
    async load(context) {
      // Feiler bygget ved fetch-feil: siten beholder forrige vellykkede deploy
      // i stedet for å publisere sider uten innhold.
      const entries = await Promise.all(
        docs.map(async (doc) => {
          const sourceUrl = sourceRawUrl(doc);
          const response = await fetch(sourceUrl);
          if (!response.ok) {
            throw new Error(
              `github-docs-loader: ${sourceUrl} svarte ${response.status}`,
            );
          }
          const raw = await response.text();
          // Kildedokumentets h1 erstattes av sidetittelen; GitHub-alerts blir
          // Starlight-asides; relative lenker/bilder pekes mot kilderepoet.
          const body = absolutizeUrls(
            githubAlertsToDirectives(stripLeadingH1(raw)),
            { blobBase: sourceBlobBase(doc), rawBase: sourceRawBase(doc) },
          );
          // Virtuell filsti under docs-collectionen gir Starlight sine
          // remark/rehype-plugins (asides, ankerlenker) et gyldig filpath,
          // slik at hentet innhold behandles som lokalt innhold. Se README.
          const rendered = await context.renderMarkdown(body, {
            fileURL: new URL(
              `src/content/docs/github/${doc.id}.md`,
              context.config.root,
            ),
          });
          return { doc, body, rendered };
        }),
      );

      context.store.clear();
      for (const { doc, body, rendered } of entries) {
        const filePath = `github/${doc.repo}/${doc.file}`;
        const data = await context.parseData({
          id: doc.id,
          data: { title: doc.title, repo: doc.repo, file: doc.file },
          filePath,
        });
        context.store.set({
          id: doc.id,
          data,
          body,
          rendered,
          filePath,
          digest: context.generateDigest(body),
        });
      }
    },
  } satisfies Loader;
}
