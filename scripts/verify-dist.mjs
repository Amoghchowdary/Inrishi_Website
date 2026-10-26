import fs from "node:fs";
import path from "node:path";
const errors=[];
if(!fs.existsSync('dist/index.html')) errors.push('dist/index.html missing.');
if(!fs.existsSync('dist/favicon.svg')) errors.push('dist/favicon.svg missing.');
if(!errors.length){
  const text=[];
  const walk=(d)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(/\.(html|js|css|svg|json|txt)$/i.test(e.name)) text.push(fs.readFileSync(p,'utf8'));}};
  walk('dist');
  const joined=text.join('\n');
  if(/\bPractice\b/.test(joined)) errors.push('Built output contains stale Practice content.');
  if(/Lovable|lovable/.test(joined)) errors.push('Built output contains Lovable content.');
  if(/localhost|Testing credentials|Test OTP|Test login|for testing only/i.test(joined)) errors.push('Built output contains local/testing content.');
  const index=fs.readFileSync('dist/index.html','utf8');
  if(!index.includes('favicon.svg')) errors.push('Built index does not reference Inrishi favicon.');
  const jsFiles=[];
  const collect=(d)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) collect(p); else if(e.name.endsWith('.js')) jsFiles.push(p);}}; collect('dist');
  if(jsFiles.length===0) errors.push('No JavaScript bundle was produced.');
}
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join('\n'));process.exit(1);}
console.log('Built-output verification passed: app bundle exists, stale content absent, Inrishi favicon present.');
