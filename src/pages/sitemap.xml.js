import { getPosts, getTopics } from "../lib/strapi";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toLastmod(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function get(context) {
  const site = context.site ?? new URL("https://barticode.com");
  const posts = await getPosts();
  const topics = await getTopics();

  const urls = [
    { loc: new URL("/", site).toString() },
    { loc: new URL("/about/", site).toString() },
    { loc: new URL("/posts/", site).toString() },
    ...posts.map((post) => ({
      loc: new URL(`/posts/${post.documentId}/`, site).toString(),
      lastmod: toLastmod(post.publication_date),
    })),
    ...topics.map((topic) => ({
      loc: new URL(`/topics/${topic.documentId}/`, site).toString(),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      ({ loc, lastmod }) =>
        `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : ""}\n  </url>`
    )
    .join("\n")}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
