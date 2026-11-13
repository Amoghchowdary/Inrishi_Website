import fs from 'node:fs';
const e=[];const need=(ok,msg)=>{if(!ok)e.push(msg)};
const home=fs.readFileSync('src/routes/index.tsx','utf8'),css=fs.readFileSync('src/styles.css','utf8');
for(const m of ['Move from manual work','Business Website','CRM','Employee Management','AI Automation','₹25,000 + GST','₹1,500 annual maintenance','From ₹15,000 + GST','Traditional','Digital foundation','AI-enabled'])need(home.includes(m),`V73 story marker missing: ${m}`);
for(const cls of ['.v73-public','.v73-story-board','.v73-product-grid','.v73-visual-grid','.v73-reel-track'])need(css.includes(cls),`V73 visual system missing: ${cls}`);
need(css.includes('Plus Jakarta Sans'),'Plus Jakarta Sans body typography missing.');
need(css.includes('Sora'),'Sora display typography missing.');
need(!home.includes('title:"ERP"')&&!home.includes('type="erp"'),'ERP returned to the public homepage.');
if(e.length){console.error(e.map(x=>`ERROR: ${x}`).join('\n'));process.exit(1)}
console.log('V73 Main design gate passed: story-first content, white typography, product visuals and ERP removal are locked.');
