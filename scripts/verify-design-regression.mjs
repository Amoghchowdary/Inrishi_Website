import fs from 'node:fs';
const e=[]; const need=(ok,msg)=>{if(!ok)e.push(msg)};
const home=fs.readFileSync('src/routes/index.tsx','utf8');
const css=fs.readFileSync('src/styles.css','utf8');
const markers=[
  'Make your business work',
  'smarter with AI.',
  'Business Website','CRM','Employee Management','ERP',
  '₹25,000 + GST','₹1,500 annual maintenance','From ₹15,000 + GST','Module-based pricing',
  'Domain + hosting + cloud server','SEO setup and Google indexing','Calling-agent workflows',
  'Customer support','Document generation','Internal approvals and workflows',
  'Book a demo','See pricing'
];
for(const m of markers)need(home.includes(m),`V70 product marker missing: ${m}`);
for(const cls of ['v69-header','v69-product','v69-price-grid','v69-ai','v69-before-after','v69-'])need(css.includes(cls),`V70 visual system missing: ${cls}`);
need(css.includes('Plus Jakarta Sans'),'Plus Jakarta Sans body typography missing.');
need(css.includes('Sora'),'Sora display typography missing.');
if(e.length){console.error(e.map(x=>`ERROR: ${x}`).join('\n'));process.exit(1)}
console.log('V70 Main design gate passed: product-first content, pricing, AI workflow visuals, and premium typography are locked.');
