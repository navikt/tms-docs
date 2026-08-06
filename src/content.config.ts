import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { githubDocsLoader } from "./content/loaders/github-docs";
import { GITHUB_DOCS } from "./github-docs.config";

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  githubDocs: defineCollection({
    loader: githubDocsLoader({ docs: GITHUB_DOCS }),
    schema: z.object({
      title: z.string(),
      repo: z.string(),
      file: z.string(),
    }),
  }),
};
