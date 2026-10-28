import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const errors=[];
const files=[];
function walk(dir){
  if(!fs.existsSync(dir)) return;
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(full);
    else if(/\.(?:ts|tsx)$/.test(entry.name)) files.push(full);
  }
}
walk(path.join(root,"src"));
for(const file of files){
  const lines=fs.readFileSync(file,"utf8").split(/\r?\n/);
  lines.forEach((line,index)=>{
    if(!line.includes(".currentTarget.elements")) return;
    if(!line.includes("FormEvent<HTMLFormElement>")){
      errors.push(`${path.relative(root,file)}:${index+1}: currentTarget.elements requires FormEvent<HTMLFormElement>.`);
    }
  });
}
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V62 form-event typing gate passed: every currentTarget.elements access is backed by FormEvent<HTMLFormElement>.");
