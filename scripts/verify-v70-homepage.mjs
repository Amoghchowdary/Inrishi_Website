import fs from "node:fs";
const home=fs.readFileSync("src/routes/index.tsx","utf8");
const css=fs.readFileSync("src/styles.css","utf8");
const fail=[];
const need=(ok,msg)=>{if(!ok)fail.push(msg)};
need(home.includes('v70-hero-visual')&&home.includes('v70-hero-image'),"V70 hero containment hooks are missing.");
need(home.includes('className="v70-hero-image-link"')&&home.includes('href="#products"'),"V70 hero image/text click target is missing.");
need(home.includes('[0,1].map(group=>')&&home.includes('v70-reel-group'),"V70 reel must render two identical groups for seamless motion.");
need(home.includes('href={`#product-${offer.id}`}')&&home.includes('v70-reel-chip'),"V70 reel product labels are not clickable.");
need(home.includes('id={`product-${offer.id}`}'),"V70 product-card anchor targets are missing.");
need(css.includes('@keyframes v70-reel')&&css.includes('translate3d(-50%,0,0)'),"V70 continuous reel animation is missing.");
need(css.includes('.v70-hero-visual .v70-hero-image')&&css.includes('object-fit:contain'),"V70 hero image containment rule is missing.");
need(css.includes('.v70-reel-track')&&css.includes('linear infinite'),"V70 reel is not configured for continuous linear motion.");
if(fail.length){console.error(fail.map(x=>`ERROR: ${x}`).join("\n"));process.exit(1)}
console.log("V70 homepage exit control passed: hero visibility, continuous reel, and click targets are locked.");
