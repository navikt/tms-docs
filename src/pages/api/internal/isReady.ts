import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async function get() {
  return new Response(null, { status: 200 });
};
