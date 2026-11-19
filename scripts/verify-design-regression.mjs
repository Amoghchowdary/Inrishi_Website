import fs from 'node:fs';
const e=[];const need=(ok,msg)=>{if(!ok)e.push(msg)};
const home=fs.readFileSync('src/routes/index.tsx','utf8'),css=fs.readFileSync('src/styles.css','utf8');
for(const m of ['Make your business AI-ready.','Business Website','CRM','Employee Management','AI Automation','₹25,000 + GST','₹1,500 annual maintenance','From ₹15,000 + GST','Traditional','Digital foundation','AI-enabled'])need(home.includes(m),`V81 story marker missing: ${m}`);
for(const cls of ['.v73-public','.v81-story-grid','.v73-product-grid','.v73-visual-grid','.v73-reel-track','.v81-tile:hover','.v81-slide:hover'])need(css.includes(cls),`V81 visual system missing: ${cls}`);
for(const asset of ['story-traditional.svg','story-digital.svg','story-ai.svg','product-website.svg','product-crm.svg','product-ems.svg','product-ai.svg'])need(home.includes(asset),`V81 image content missing: ${asset}`);
need(css.includes('Plus Jakarta Sans'),'Plus Jakarta Sans body typography missing.');
need(css.includes('Sora'),'Sora display typography missing.');
need(!home.includes('How it works')&&!home.includes('href="#how"'),'How it works returned to Main.');
need(!home.includes('title:"ERP"')&&!home.includes('type="erp"'),'ERP returned to the public homepage.');
if(e.length){console.error(e.map(x=>`ERROR: ${x}`).join('\n'));process.exit(1)}
console.log('V81 Main design gate passed: short hero, richer imagery, white/black hover tiles, continuous reel and ERP removal are locked.');
