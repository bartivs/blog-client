import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = process.cwd();

const shellEnvKeys = new Set(Object.keys(process.env));

function loadEnvFile(filePath, { override = false } = {}) {
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['\"]|['\"]$/g, "");

    if (shellEnvKeys.has(key)) {
      continue;
    }

    if (!(key in process.env) || override) {
      process.env[key] = value;
    }
  }
}

const envPath = resolve(projectRoot, ".env");
if (existsSync(envPath)) {
  loadEnvFile(envPath);
}

const envLocalPath = resolve(projectRoot, ".env.local");
if (existsSync(envLocalPath)) {
  loadEnvFile(envLocalPath, { override: true });
}

const siteUrl = (process.env.SITE_URL || "https://barticode.com").replace(/\/+$/, "");
const strapiUrl = (process.env.STRAPI_URL || "http://localhost:1337").replace(/\/+$/, "");
const strapiToken = process.env.STRAPI_API_TOKEN || "";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toAbsoluteUrl(pathname) {
  return `${siteUrl}${pathname}`;
}

function formatLastmod(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function strapiFetch(endpoint, searchParams = new URLSearchParams()) {
  const url = `${strapiUrl}/api/${endpoint}?${searchParams.toString()}`;
  const headers = {
    "Content-Type": "application/json",
  };

  if (strapiToken) {
    headers.Authorization = `Bearer ${strapiToken}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function getPosts() {
  const params = new URLSearchParams();
  params.append("sort", "publication_date:desc");
  params.append("pagination[pageSize]", "100");
  const response = await strapiFetch("posts", params);
  return response.data || [];
}

async function getTopics() {
  const response = await strapiFetch("topics");
  return response.data || [];
}

const posts = await getPosts();
const topics = await getTopics();

const urls = [
  { loc: toAbsoluteUrl("/") },
  { loc: toAbsoluteUrl("/about/") },
  { loc: toAbsoluteUrl("/posts/") },
  ...posts.map((post) => ({
    loc: toAbsoluteUrl(`/posts/${post.documentId}/`),
    lastmod: formatLastmod(post.publication_date),
  })),
  ...topics.map((topic) => ({
    loc: toAbsoluteUrl(`/topics/${topic.documentId}/`),
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map(({ loc, lastmod }) => `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : ""}\n  </url>`)
  .join("\n")}\n</urlset>\n`;

writeFileSync(resolve(projectRoot, "public/sitemap.xml"), xml);
console.log(`Generated public/sitemap.xml with ${urls.length} URLs`);
