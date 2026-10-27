const repo="Inrishi_Website";
const routes=["/customer-login", "/customer-portal", "/admin"];
const errors=[];
function siteBase(hostname,pathname){if(!hostname.toLowerCase().endsWith(".github.io"))return"";const first=pathname.split("/").filter(Boolean)[0]??"";return first.toLowerCase()===repo.toLowerCase()?`/${first}`:""}
function href(hostname,currentPath,path){const base=siteBase(hostname,currentPath);if(path==="/")return`${base}/`;return path.startsWith("/")?`${base}${path}`:path}
function recover(hostname,pathname,search="",hash=""){const parts=pathname.split("/").filter(Boolean);const onGithub=/\.github\.io$/i.test(hostname)&&(parts[0]||"").toLowerCase()===repo.toLowerCase();const base=onGithub?`/${parts[0]}`:"";let route=pathname.slice(base.length);if(!route.startsWith("/"))route="/"+route;const encoded=route.slice(1).replace(/&/g,"~and~");return base+"/?/"+encoded+search+hash}
function restore(urlPath){const q=urlPath.indexOf("?/" );if(q<0)return urlPath;const path=urlPath.slice(0,q);const decoded=urlPath.slice(q+1).split("&").map(s=>s.replace(/~and~/g,"&")).join("?");return path.slice(0,-1)+decoded}
for(const r of routes){const gh=href("amoghchowdary.github.io",`/${repo}/`,r);if(gh!==`/${repo}${r}`)errors.push(`GitHub href escaped base: ${r} -> ${gh}`);const custom=href("www.inrishi.in","/",r);if(custom!==r)errors.push(`Custom-domain href changed: ${r} -> ${custom}`);const recoveredGh=restore(recover("amoghchowdary.github.io",`/${repo}${r}`));if(recoveredGh!==`/${repo}${r}`)errors.push(`GitHub direct-route recovery failed: ${r} -> ${recoveredGh}`);const recoveredCustom=restore(recover("www.inrishi.in",r));if(recoveredCustom!==r)errors.push(`Custom direct-route recovery failed: ${r} -> ${recoveredCustom}`);}
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V60 MAIN route recovery passed for GitHub project path and custom-domain root.");
