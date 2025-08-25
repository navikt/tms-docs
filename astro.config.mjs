// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "TMS Docs",
      social: [
        {
          icon: "slack",
          label: "Slack",
          href: "https://nav-it.slack.com/archives/C0912F59V29",
        },
      ],
      sidebar: [
        {
          label: "Microfrontends",
          items: [
            {
              label: "Microfrontend SSR",
              slug: "microfrontends/microfrontend-ssr",
            },
            {
              label: "Microfrontend CSR",
              slug: "microfrontends/microfrontend-csr",
            },
          ],
        },
        { label: "Varsler", slug: "varsler" },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],

  adapter: node({
    mode: "standalone",
  }),
});