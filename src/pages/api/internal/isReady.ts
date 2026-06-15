export const prerender = false;

import type {APIRoute} from "astro";

export const GET: APIRoute = async function get({params, request}) {
  return new Response(null, {status: 200});
};
