/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev` in your terminal to local development.
 * - Run `npx wrangler deploy` to publish.
 * - Open the Workers dashboard: https://dash.cloudflare.com/
 */

const OPENAI_API_HOST = "api.groq.com";
const UPSTREAM_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0";

export default {
  async fetch(request, env, ctx): Promise<Response> {
    try {
      const oldUrl = new URL(request.url);

      if (oldUrl.pathname === "/") {
        return new Response(`https://${oldUrl.hostname}/openai/v1`, {
          status: 200,
        });
      }

      const newUrl = new URL(request.url);
      newUrl.hostname = OPENAI_API_HOST;

      const headers = new Headers(request.headers);
      headers.set("User-Agent", UPSTREAM_USER_AGENT);
      headers.delete("cf-connecting-ip");
      headers.delete("x-forwarded-for");
      headers.delete("x-real-ip");
      headers.delete("true-client-ip");
      headers.delete("forwarded");

      const modifiedRequest = new Request(newUrl, {
        method: request.method,
        headers,
        body: request.body,
      });

      return await fetch(modifiedRequest);
    } catch (e) {
      return new Response(e instanceof Error ? e.stack : String(e), {
        status: 500,
      });
    }
  },
} satisfies ExportedHandler;
