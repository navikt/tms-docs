// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://tms-docs.nav.no",
  integrations: [
    starlight({
      title: "Min side docs",
      locales: {
        root: { label: "Norsk bokmål", lang: "nb" },
      },
      logo: { src: "./src/assets/tms-logo.png", alt: "Min side" },
      favicon: "/tms-logo.png",
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "https://tms-docs.nav.no/tms-logo.png",
          },
        },
      ],
      editLink: {
        baseUrl: "https://github.com/navikt/tms-docs/edit/main/",
      },
      lastUpdated: true,
      routeMiddleware: "./src/routeData.ts",
      plugins: [starlightLinksValidator()],
      social: [
        {
          icon: "slack",
          label: "Slack",
          href: "https://nav-it.slack.com/archives/C0912F59V29",
        },
      ],
      sidebar: [
        {label: "Om Min side", slug: "about"},

        {
          label: "Microfrontends",
          items: [
            {
              label: "Microfrontend SSR",
              slug: "microfrontends/microfrontend-ssr",
            },
          ],
        },
        {label: "Utkast", slug: "utkast"},
        {
          label: "Varsler",
          items: [
            {
              label: "Komme i gang",
              slug: "varsler/start",
            },
            {
              label: "Konsumere varsler",
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
