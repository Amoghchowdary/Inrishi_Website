import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const fail=(m)=>{console.error(`PERFORMANCE FAIL: ${m}`);process.exit(1)};
const pkg=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
if(pkg.version!=="81.0.0") fail(`expected 81.0.0, got ${pkg.version}`);
const walk=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=path.join(dir,e.name);return e.isDirectory()?walk(p):[p]});
const assets=walk(path.join(root,"src","assets"));
for(const f of assets){const size=fs.statSync(f).size;if(/\.(png|jpe?g|webp)$/i.test(f)&&size>2100000) fail(`oversized source raster ${path.relative(root,f)} ${(size/1048576).toFixed(2)}MB`)}
const sources=walk(path.join(root,"src")).filter(f=>/\.(tsx?|css)$/i.test(f)).map(f=>fs.readFileSync(f,"utf8")).join("\n");
if(sources.includes("images.unsplash.com")&&!sources.includes('loading="lazy"')) fail("external photography must be lazy-loaded");
if(!sources.includes("prefers-reduced-motion")) fail("reduced-motion guard missing");
if(!sources.includes("content-visibility:auto")) fail("content-visibility optimization missing");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
if(!html.includes("googletagmanager.com")) fail("GTM resource missing");
if(!html.includes('rel="preconnect" href="https://www.googletagmanager.com"')) fail("GTM preconnect missing");
console.log("V81 performance gate passed");
