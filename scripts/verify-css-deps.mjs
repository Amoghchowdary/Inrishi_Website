import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const pkg=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
const declared={...(pkg.dependencies??{}),...(pkg.devDependencies??{})};
const errors=[];
const refs=[];
const exts=new Set([".css"]);
const skip=new Set(["node_modules","dist",".git"]);

function walk(dir){
  if(!fs.existsSync(dir)) return;
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(skip.has(entry.name)) continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(full);
    else if(exts.has(path.extname(entry.name).toLowerCase())){
      const text=fs.readFileSync(full,"utf8");
      const rx=/@(import|plugin)\s+(?:url\()?\s*["']([^"']+)["']/g;
      let m; while((m=rx.exec(text))){
        const spec=m[2].trim();
        if(spec.startsWith(".")||spec.startsWith("/")||spec.startsWith("http:")||spec.startsWith("https:")||spec.startsWith("data:")) continue;
        const pkgName=spec.startsWith("@")?spec.split("/").slice(0,2).join("/"):spec.split("/")[0];
        refs.push({file:path.relative(root,full),kind:m[1],spec,pkgName});
      }
    }
  }
}
walk(path.join(root,"src"));
walk(path.join(root,"public"));

for(const ref of refs){
  if(!declared[ref.pkgName]) errors.push(`${ref.file}: CSS @${ref.kind} references undeclared package ${ref.pkgName} (${ref.spec}).`);
  const manifest=path.join(root,"node_modules",...ref.pkgName.split("/"),"package.json");
  if(fs.existsSync(path.join(root,"node_modules"))&&!fs.existsSync(manifest)) errors.push(`${ref.file}: CSS package ${ref.pkgName} is declared but not installed in node_modules.`);
}
if(!refs.some(r=>r.pkgName==="tailwindcss")) errors.push("Tailwind CSS package import is missing from source CSS.");
if(!refs.some(r=>r.pkgName==="tw-animate-css")) errors.push("tw-animate-css import is missing; Radix dialog animation utilities depend on it.");
const dialog=fs.readFileSync(path.join(root,"src/components/ui/dialog.tsx"),"utf8");
for(const utility of ["animate-in","animate-out","fade-in-0","fade-out-0","zoom-in-95","zoom-out-95"]) if(!dialog.includes(utility)) errors.push(`Dialog animation utility is missing or changed: ${utility}`);
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1);}
console.log(`V57 CSS dependency integrity passed: ${refs.length} package CSS reference(s) declared${fs.existsSync(path.join(root,"node_modules"))?" and installed":""}.`);
