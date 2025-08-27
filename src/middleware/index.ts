import { defineMiddleware } from "astro/middleware";
import { loginUrl } from "./urls.ts";
import { isInternal } from "./utils.ts";
import { isLocal } from "../utils/environment";
import { getToken, validateToken } from "@navikt/oasis";

export const onRequest = defineMiddleware(async (context, next) => {
  const token = getToken(context.request.headers);
  const params = encodeURIComponent(context.url.search);

  if (isLocal) {
    return next();
  }

  if (isInternal(context)) {
    return next();
  }

  if (!token) {
    console.info(
      "Could not find any bearer token on the request. Redirecting to login."
    );
    return context.redirect(`${loginUrl}${params}`);
  }

  const validation = await validateToken(token);

  if (!validation.ok) {
    const error = new Error(
      `Invalid JWT token found (cause: ${validation.errorType} ${validation.error}, redirecting to login.`
    );
    console.error(error);
    return context.redirect(`${loginUrl}${params}`);
  }
  return next();
});
