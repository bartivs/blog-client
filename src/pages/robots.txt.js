export async function get(context) {
  const site = (context.site ?? new URL("https://barticode.com")).toString().replace(/\/+$/, "");

  return new Response(
    `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
