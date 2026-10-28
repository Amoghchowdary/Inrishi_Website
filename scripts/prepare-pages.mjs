import fs from "node:fs";import path from "node:path";
const raw=(process.argv[2]||process.env.SITE_DOMAIN||"").trim().replace(/^https?:\/\//,"").replace(/\/$/,"");if(!raw||!/^[a-z0-9.-]+$/i.test(raw)){console.error("ERROR: SITE_DOMAIN is required");process.exit(1)}
const dist=path.resolve("dist");if(!fs.existsSync(dist)){console.error("ERROR: dist/ not found");process.exit(1)}const origin=`https://${raw}`;
const pages=[
 ["/","Inrishi | Intelligence inside.","Inrishi provides AI business transformation, ERP, CRM, employee management, custom software, SaaS products and website design with search-readiness support."],
 ["/services","Business Software, ERP, CRM, AI Automation & Website Services | Inrishi","Explore Inrishi services including AI business transformation, ERP, CRM, employee management, books customization, custom software, SaaS products and website design."],
 ["/partner-program","Become an Inrishi Partner | Partner Program","Learn how to become an Inrishi Partner, refer eligible services, track customer conversion and become eligible for configured incentives."],
 ["/sample-work","Sample Work | Inrishi","Explore examples of Inrishi business software, automation and digital implementation work."],
 ["/contact","Contact Inrishi | Business Software & Automation","Contact Inrishi to discuss business software, automation, ERP, CRM, custom software or website requirements."],
 ["/services/ai-business-transformation","AI Business Transformation Services | Inrishi","Practical AI and automation for repetitive work, approvals, information flow and business visibility."],
 ["/services/erp","ERP Software & Business Operations | Inrishi","Connect sales, purchases, inventory, finance, records and approvals through an Inrishi ERP workflow."],
 ["/services/crm","CRM Software & Lead Management | Inrishi","Manage leads, follow-ups, customer history and sales conversion with Inrishi CRM workflows."],
 ["/services/employee-management","Employee Management Software | Inrishi","Organise employee records, attendance, leave, requests and people operations."],
 ["/services/books-customization","Accounting & Books Customization | Inrishi","Adapt accounting and business-book workflows to your formats, approvals and reporting needs."],
 ["/services/custom-software","Custom Business Software Development | Inrishi","Build custom web or desktop software around your business workflow and users."],
 ["/services/saas-products","Inrishi SaaS Products | Business Software","Configure and adopt Inrishi cloud software products for common business requirements."],
 ["/services/website-design","Business Website Design & SEO Readiness | Inrishi","Responsive business website design, deployment, indexing readiness and post-launch SEO support from Inrishi."],
];
const escapeXml=v=>v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(([r])=>`  <url><loc>${escapeXml(origin+(r==="/"?"/":r))}</loc></url>`).join("\n")}\n</urlset>\n`;
const robots=`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /r/\nDisallow: /customer-login\nDisallow: /customer-portal\nSitemap: ${origin}/sitemap.xml\n`;
const source=fs.readFileSync(path.join(dist,"index.html"),"utf8");
function metadata(html,title,description,canonical){let x=html.replace(/<title>.*?<\/title>/i,`<title>${title}</title>`).replace(/<meta\s+name=["']description["'][^>]*>/i,`<meta name="description" content="${description}" />`);x=x.replace(/<meta\s+name=["']robots["'][^>]*>/i,'<meta name="robots" content="index,follow" />');x=x.replace(/<link\s+rel=["']canonical["'][^>]*>/i,"");x=x.replace("</head>",`<link rel="canonical" href="${canonical}" />\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${description}" />\n<meta property="og:type" content="website" />\n<meta property="og:url" content="${canonical}" />\n<meta name="twitter:card" content="summary_large_image" />\n</head>`);return x}
function nestedHtml(route,title,description){const depth=route.split('/').filter(Boolean).length,prefix='../'.repeat(depth);let h=metadata(source,title,description,origin+route);h=h.replace(/(?:src|href)=["']\.\/([^"']+)["']/g,(_,p)=>`${_.startsWith('src')?'src':'href'}="${prefix}${p}"`);h=h.replace(/src=["']\.\/assets\//g,`src="${prefix}assets/`).replace(/href=["']\.\/assets\//g,`href="${prefix}assets/`);return h}
for(const [route,title,desc] of pages){if(route==="/"){fs.writeFileSync(path.join(dist,"index.html"),metadata(source,title,desc,origin+"/"));continue}const dir=path.join(dist,...route.split('/').filter(Boolean));fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,"index.html"),nestedHtml(route,title,desc))}
fs.writeFileSync(path.join(dist,".nojekyll"),"");fs.writeFileSync(path.join(dist,"sitemap.xml"),sitemap);fs.writeFileSync(path.join(dist,"robots.txt"),robots);console.log(`Prepared ${pages.length} SEO-aware Main Pages routes for ${origin}`);
