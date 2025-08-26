// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "TMS Docs",
      prerender: false,
      social: [
        {
          icon: "slack",
          label: "Slack",
          href: "https://nav-it.slack.com/archives/C0912F59V29",
        },
      ],
      sidebar: [
        { label: "Om Min side", slug: "about" },

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
        { label: "Utkast", slug: "utkast" },
        {
          label: "Varsler",
          items: [
            {
              label: "Komme i gang",
              slug: "varsler/start",
            },
            {
              label: "Konsumere",
              slug: "varsler/konsumere",
            },
            {
              label: "Migrere fra AVRO",
              slug: "varsler/migrere",
            },
          ],
        },
      ],
    }),
  ],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
