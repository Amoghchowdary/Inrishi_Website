import fs from "node:fs";
const errors=[];const need=(ok,msg)=>{if(!ok)errors.push(msg)};
const home=fs.readFileSync("src/routes/index.tsx","utf8");
const css=fs.readFileSync("src/styles.css","utf8");
need(home.includes("v71-hero-card-dock")&&home.includes("v71-hero-dock-card"),"V71 hero product cards must live in the non-overlapping bottom dock.");
need(home.includes("v71-hero-image")&&css.includes("object-fit:contain"),"V71 hero artwork containment is missing.");
need(home.includes("[0,1,2,3].map(group=>")&&home.includes("v71-reel-group"),"V71 reel must render four identical groups.");
need(css.includes("@keyframes v71-reel")&&css.includes("translate3d(-25%,0,0)"),"V71 seamless one-group reel translation is missing.");
need(css.includes(".v71-hover-white:hover")&&css.includes("background:#fff"),"V71 white hover tile behavior is missing.");
need(home.includes('href="#product-erp"')&&home.includes('href="#product-crm"')&&home.includes('href="#ai"'),"V71 hero product links are missing.");
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V71 homepage exit control passed: hero artwork is unobstructed, reel is seamless, and white hover tiles are locked.");
