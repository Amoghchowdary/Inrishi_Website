import fs from "node:fs";
const endpoint="https://script.google.com/macros/s/AKfycbzQ1YMIghWp_p3hy3NxsJraffY_AjLA77JlyfYF7YvkGlylLnV2MiDgJViLjByn9ntq/exec";
const contract=JSON.parse(fs.readFileSync("backend-contract.json","utf8"));
const expectedVersion=String(contract.version||"");
const expectedHealthTransport=contract.transport==="apps-script-form-post"?"form-post":String(contract.transport||"");
if(!/^\d+\.\d+\.\d+$/.test(expectedVersion)){console.error("ERROR: backend-contract.json has an invalid version.");process.exit(1)}
const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
try{
  const response=await fetch(endpoint,{redirect:"follow",signal:controller.signal,headers:{"accept":"application/json"}});
  const text=await response.text();
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  let data;try{data=JSON.parse(text)}catch{throw new Error(`Backend health was not JSON: ${text.slice(0,120)}`)}
  if(data.status!=="online")throw new Error(`Backend status is ${data.status??"missing"}`);
  if(data.configured!==true)throw new Error("Backend database is not configured.");
  if(String(data.version)!==expectedVersion)throw new Error(`Expected Apps Script contract ${expectedVersion} but deployed backend is ${data.version??"unknown"}`);
  if(data.transport!==expectedHealthTransport)throw new Error(`Expected ${expectedHealthTransport} transport but received ${data.transport??"unknown"}`);
  console.log(`Apps Script production health passed: contract ${expectedVersion}, configured, ${data.transport}.`);
}catch(error){console.error(`ERROR: Apps Script production health failed: ${error instanceof Error?error.message:String(error)}`);process.exit(1)}
finally{clearTimeout(timer)}
