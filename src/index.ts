/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev` in your terminal to local development.
 * - Run `npx wrangler deploy` to publish.
 * - Open the Workers dashboard: https://dash.cloudflare.com/
 */

const OPENAI_API_HOST = "api.groq.com";

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

      const modifiedRequest = new Request(newUrl, {
        method: request.method,
        headers: request.headers,
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
