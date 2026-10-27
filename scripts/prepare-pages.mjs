import fs from "node:fs";
import path from "node:path";

const raw = (process.argv[2] || process.env.SITE_DOMAIN || "").trim().replace(/^https?:\/\//,"").replace(/\/$/,"");
if (!raw || !/^[a-z0-9.-]+$/i.test(raw)) { console.error("ERROR: SITE_DOMAIN is required, e.g. www.inrishi.in or partner.inrishi.in"); process.exit(1); }
const dist = path.resolve("dist");
if (!fs.existsSync(dist)) { console.error("ERROR: dist/ not found. Run npm run build first."); process.exit(1); }
const origin = `https://${raw}`;
const partner = raw.toLowerCase().startsWith("partner.");
const publicRoutes = partner ? ["/"] : ["/", "/sample-work", "/contact"];
const escapeXml = value => value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicRoutes.map(route => `  <url><loc>${escapeXml(origin + route)}</loc></url>`).join("\n")}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /r/\nDisallow: /customer-login\nDisallow: /customer-portal\nDisallow: /login\nDisallow: /register\nDisallow: /portal\nSitemap: ${origin}/sitemap.xml\n`;
const title = partner ? "Become an Inrishi Partner | Inrishi" : "Inrishi | Intelligence inside.";
const description = partner
  ? "Become an Inrishi Partner, introduce customers to Inrishi services, track projects and manage incentives through one structured partner programme."
  : "Inrishi provides AI business transformation, ERP, CRM, employee management, custom software, SaaS products and complete website design with post-launch SEO support.";
const indexPath = path.join(dist, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
html = html.replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?\s*>/i, `<meta name="description" content="${description}" />`);
if (!/<link\s+rel=["']canonical["']/i.test(html)) html = html.replace("</head>", `  <link rel="canonical" href="${origin}/" />\n  </head>`);
else html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${origin}/" />`);
if (!/<meta\s+property=["']og:title["']/i.test(html)) html = html.replace("</head>", `  <meta property="og:title" content="${title}" />\n  <meta property="og:description" content="${description}" />\n  <meta property="og:type" content="website" />\n  <meta property="og:url" content="${origin}/" />\n  </head>`);
fs.writeFileSync(indexPath, html);
fs.writeFileSync(path.join(dist, ".nojekyll"), "");
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(dist, "robots.txt"), robots);
console.log(`Prepared GitHub Pages output for ${origin}`);
