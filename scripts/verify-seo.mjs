import fs from 'node:fs';
const e=[];const need=(ok,msg)=>{if(!ok)e.push(msg)};const read=f=>fs.readFileSync(f,'utf8');
const home=read('src/routes/index.tsx'),html=read('index.html'),sitemap=read('public/sitemap.xml'),robots=read('public/robots.txt');
for(const m of ['AI software for growing businesses','Websites, CRM, employee management, ERP and AI automation','Business Website','CRM','Employee Management','ERP'])need(home.includes(m),`Main acquisition/SEO marker missing: ${m}`);
need(html.toLowerCase().includes('inrishi'),'index.html brand metadata missing.');
need(sitemap.includes('inrishi.in'),'sitemap domain missing.');
need(robots.toLowerCase().includes('sitemap'),'robots sitemap reference missing.');
need(home.includes('https://partner.inrishi.in/'),'Main Partner acquisition CTA missing.');
if(e.length){console.error(e.map(x=>`ERROR: ${x}`).join('\n'));process.exit(1)}
console.log('V70 Main SEO gate passed: AI software positioning, core products, sitemap and Partner acquisition CTA are present.');
