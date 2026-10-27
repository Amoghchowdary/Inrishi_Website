import fs from "node:fs"; import path from "node:path";
const errors=[]; const must=(ok,msg)=>{if(!ok)errors.push(msg)}; const dist=path.resolve("dist");
must(fs.existsSync(dist),"dist directory is missing.");
if(fs.existsSync(dist)){
 const htmlPath=path.join(dist,"index.html"); must(fs.existsSync(htmlPath),"dist/index.html is missing.");
 if(fs.existsSync(htmlPath)){ const html=fs.readFileSync(htmlPath,"utf8");
   must(!/(?:src|href)=["']\/(?:assets|favicon|inrishi-config)/i.test(html),"Root-absolute production asset reference detected.");
   for(const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){ const ref=match[1]; if(/^\.\//.test(ref)){ const clean=ref.replace(/^\.\//,"").split(/[?#]/)[0]; if(clean&&!/^https?:/.test(clean))must(fs.existsSync(path.join(dist,clean)),`Referenced artifact is missing: ${clean}`); } }
 }
 for(const rel of ["404.html","inrishi-config.js","favicon.png","inrishi-public-logo.png","v38-cosmic-reference.jpg"])must(fs.existsSync(path.join(dist,rel)),`Production artifact missing: ${rel}`);
 const cfg=fs.existsSync(path.join(dist,"inrishi-config.js"))?fs.readFileSync(path.join(dist,"inrishi-config.js"),"utf8"):"";
 must(cfg.includes('APP_VERSION: "60.0.0"'),"Built runtime config is not V60.");
 must(cfg.includes('SITE_ID: "main"'),"Built runtime site identity is wrong.");
 const four=fs.existsSync(path.join(dist,"404.html"))?fs.readFileSync(path.join(dist,"404.html"),"utf8"):"";
 must(four.includes('var repo="Inrishi_Website"'),"404 route recovery repository identity is wrong.");
 const assetsDir=path.join(dist,"assets"), assets=fs.existsSync(assetsDir)?fs.readdirSync(assetsDir):[];
 must(assets.some(x=>x.endsWith(".js")),"Compiled JavaScript bundle is missing."); must(assets.some(x=>x.endsWith(".css")),"Compiled CSS bundle is missing.");
}
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V60 production artifact integrity passed for main.");
