import { getEnvironment } from "../utils//environment.ts";

const REDIRECT_URI = {
  local: "http://localhost:4321/",
  dev: "https://tms-docs.ansatt.dev.nav.no/",
  prod: "https://tms-docs.ansatt.nav.no/",
};

export const redirectUri = REDIRECT_URI[getEnvironment()];
export const loginUrl = `/oauth2/login?redirect=${redirectUri}`;
