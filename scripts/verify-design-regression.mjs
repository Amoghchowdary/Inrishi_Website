import fs from "node:fs";
import crypto from "node:crypto";

const read=(f)=>fs.readFileSync(f,"utf8");
const errors=[];
const check=(ok,msg)=>{if(!ok) errors.push(msg)};
const home=read("src/routes/index.tsx");
const cosmic=read("src/components/cosmic-environment.tsx");
const styles=read("src/styles.css");
const footer=read("src/components/site-footer.tsx");
const html=read("index.html");
const config=read("public/inrishi-config.js");

check(config.includes('APP_VERSION: "55.0.0"'),"Design gate must run against V55 runtime config.");
check(home.includes('import heroArt from "@/assets/inrishi-v46-hero.png";'),"V55 refined robot/INRISHI hero asset is not active.");
check(home.includes('import inrishiLogo from "@/assets/inrishi-public-logo.png";'),"Approved brand logo is not assigned to the header.");
check(home.includes('className="public-brand-logo"'),"Top-left brand logo is missing.");
check(!home.includes('section-public-brand-logo'),"Public brand logo must not be repeated inside homepage sections.");
check(home.includes('>Intelligence inside.</p>'),'Hero tagline must remain exactly "Intelligence inside."');
check(home.includes("Explore solutions"),"Explore solutions CTA is missing.");
check(home.includes("Start a conversation"),"Start a conversation CTA is missing.");
check(home.includes("EXPLORE OUR UNIVERSE"),"Explore-universe cue is missing.");
check(home.includes('text-base leading-8 text-muted-foreground'),"Service detail body typography has regressed below the V55 readability baseline.");
check(home.includes('text-base leading-7 text-muted-foreground'),"Service list/outcome typography has regressed below the V55 readability baseline.");
check(home.includes('text-[28px] font-semibold'),"Service detail heading size has regressed.");

check(cosmic.includes('import v38Backdrop from "@/assets/v38-cosmic-reference.jpg";'),"Local V38 cosmic backdrop is missing.");
check(cosmic.includes("v38-cosmic-reference"),"V38 cosmic layer is not rendered.");
check(cosmic.includes("cosmic-star-canvas"),"Procedural star canvas is missing.");
check(!/https?:\/\//.test(cosmic),"Cosmic environment must remain self-contained/local.");
check(styles.includes("V46 — V38 HOMEPAGE VISUAL RESTORE"),"V38 restoration CSS block is missing.");
check(styles.includes("V46 — approved hero grip refinement + readability pass only."),"V46 approved design delta CSS block is missing.");
check(styles.includes(".v38-panel"),"V38 dark/translucent homepage panels are missing.");
check(!footer.includes("inrishi-public-logo.png"),"Brand logo must not be repeated in the footer.");
check(html.includes('%BASE_URL%favicon.png'),"Approved favicon is not referenced through Vite BASE_URL.");
check(styles.includes("V46 — exact public logo + transparent-to-white service tile interaction."),"V46 logo/tile interaction CSS block is missing.");
check(styles.includes("background: transparent !important;"),"V55 tiles must be transparent at rest.");
check(styles.includes(".v38-panel:hover {"),"V55 white-hover tile state is missing.");
check(styles.includes("background: #ffffff !important;"),"V55 tiles must become white on hover.");
check(styles.includes(".v38-panel:hover h1"),"V55 hover contrast rules for tile headings are missing.");
check(styles.includes(".v38-panel:hover .solution-icon-chip"),"V55 hover icon contrast rules are missing.");

const expected={
  "src/assets/inrishi-public-logo.png":"a8ba659188c2b8b522fd7c82d5b6be5b514ad7115c71bbe1d95ea5334d49da45",
  "public/inrishi-logo.png":"a8ba659188c2b8b522fd7c82d5b6be5b514ad7115c71bbe1d95ea5334d49da45",
  "public/favicon.png":"67ce2fad7a62ed55ed56e293f32f20a39ff20e074d23ca40542f5d65df56e226",
  "src/assets/inrishi-v46-hero.png":"b0af6b924bd49c439bf7de6721cdca33b569eccd2a43b525fcd41a1f1d4e0f1f",
  "src/assets/v38-cosmic-reference.jpg":"d61ab658a5fb72d4c4c284c28600b71cde5f17f99f81d66386824dd7b0bd0418"
};
for(const [asset,hash] of Object.entries(expected)){
  check(fs.existsSync(asset),`Missing V55 design asset: ${asset}`);
  if(fs.existsSync(asset)){const actual=crypto.createHash("sha256").update(fs.readFileSync(asset)).digest("hex");check(actual===hash,`Approved design asset changed: ${asset}`);}
}
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1);}
console.log("V55 design exit control passed: approved V46 visual design is unchanged while V55 security/portal corrections remain outside the public design system.");
