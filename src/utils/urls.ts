import { getEnvironment } from "./environment";

const EXAMPLE_API_URL = {
  local: "http://localhost:3000/api/tms-astro-template",
  dev: "http://example-your-api-app/api/something",
  prod: "http://example-your-api-app/api/something",
};

const BASE_URL = {
  local: "http://localhost:4321/tms-astro-template",
  dev: "https://www.ansatt.dev.nav.no/tms-astro-template/",
  prod: "https://www.nav.no/tms-astro-template/",
};

export const exampleApiUrl = EXAMPLE_API_URL[getEnvironment()];
export const redirectUri = BASE_URL[getEnvironment()];
