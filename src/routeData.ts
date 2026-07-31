import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import { getEntry } from "astro:content";
import { docBySlug, sourceEditUrl } from "./github-docs.config";
import { buildToc } from "./toc";

/**
 * Sider som viser github-hentet innhold har ingen headings i sin egen mdx-fil,
 * så Starlight sitt "På denne siden"-panel blir tomt. Denne middlewaren bygger
 * toc fra det rendrede innholdet i githubDocs-collectionen, og peker
 * "Rediger siden"-lenken mot kilderepoet.
 */
export const onRequest = defineRouteMiddleware(async (context) => {
  const route = context.locals.starlightRoute;
  const doc = docBySlug(route.id);
  if (!doc) return;

  const entry = await getEntry("githubDocs", doc.id);
  const headings = entry?.rendered?.metadata?.headings;
  if (Array.isArray(headings) && route.toc) {
    const { minHeadingLevel, maxHeadingLevel } = route.toc;
    route.toc.items = [
      { depth: 2, slug: "_top", text: "Oversikt", children: [] },
      ...buildToc(headings, minHeadingLevel, maxHeadingLevel),
    ];
  }

  route.editUrl = new URL(sourceEditUrl(doc));
});
