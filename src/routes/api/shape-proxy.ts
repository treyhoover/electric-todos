import { getSecret } from "@env/secrets";
import { vars } from "@env/vars";
import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/api/shape-proxy").methods({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const electricSecret = getSecret("ELECTRIC_SECRET");

    // Build the upstream Electric SQL URL
    const electricUrl = new URL(vars.VITE_ELECTRIC_URL);

    // Copy over the client params
    searchParams.forEach((value, key) => {
      electricUrl.searchParams.set(key, value);
    });

    // Inject server-side credentials
    electricUrl.searchParams.set("source_id", vars.VITE_ELECTRIC_SOURCE_ID);
    electricUrl.searchParams.set("secret", electricSecret);

    // Forward the request to Electric SQL
    const response = await fetch(electricUrl, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
      },
    });

    // Return the response, removing problematic headers
    const headers = new Headers(response.headers);
    headers.delete("content-encoding");
    headers.delete("content-length");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
});
