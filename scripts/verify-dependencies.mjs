import fs from "node:fs";

const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const errors=[];
const runtimeAllow=["@radix-ui/react-dialog","@radix-ui/react-slot","@tanstack/react-query","@tanstack/react-router","class-variance-authority","clsx","lucide-react","react","react-dom","tailwind-merge"].sort();
const actualRuntime=Object.keys(pkg.dependencies??{}).sort();
const vite=pkg.devDependencies?.vite??"";
const tailwindVite=pkg.devDependencies?.["@tailwindcss/vite"]??"";
const tailwind=pkg.devDependencies?.tailwindcss??"";
const twAnimate=pkg.devDependencies?.["tw-animate-css"]??"";
const reactPlugin=pkg.devDependencies?.["@vitejs/plugin-react"]??"";
if(pkg.name!=="inrishi-website-v69-main-production")errors.push("Unexpected package name.");
if(pkg.version!=="70.0.0")errors.push("V70 package version must be 70.0.0.");
if(JSON.stringify(actualRuntime)!==JSON.stringify(runtimeAllow))errors.push(`Runtime dependency allowlist mismatch: ${actualRuntime.join(", ")}`);
if(vite!=="8.3.5")errors.push("Vite must be pinned to security-patched 8.3.5.");
if(tailwindVite!=="4.3.3"||tailwind!=="4.3.3")errors.push("Tailwind Vite and Tailwind CSS must be pinned to 4.3.3 as build-only dependencies.");
if(twAnimate!=="1.4.0")errors.push("tw-animate-css must be pinned to 1.4.0 because src/styles.css imports it.");
if(reactPlugin!=="5.2.0")errors.push("@vitejs/plugin-react must remain 5.2.0.");
for(const removed of ["zod","@hookform/resolvers","react-hook-form","recharts","sonner","cmdk","vaul"])if(pkg.dependencies?.[removed]||pkg.devDependencies?.[removed])errors.push(`Unused/high-risk dependency must not return: ${removed}`);
for(const buildOnly of ["vite","@vitejs/plugin-react","@tailwindcss/vite","tailwindcss","tw-animate-css","typescript"])if(pkg.dependencies?.[buildOnly])errors.push(`Build-only package must not be a production dependency: ${buildOnly}`);
if(!pkg.engines?.node?.includes("22.12.0"))errors.push("Node engine floor must remain 22.12.0.");
const viteConfig=fs.readFileSync("vite.config.ts","utf8");
if(/minify\s*:\s*["']esbuild["']/.test(viteConfig))errors.push("Deprecated esbuild minification must not return.");
if(!/minify\s*:\s*["']oxc["']/.test(viteConfig))errors.push("Vite production minifier must remain Oxc.");
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1);}
console.log(`V70 dependency policy verified: Vite ${vite}; Tailwind ${tailwind}; tw-animate-css ${twAnimate}; ${actualRuntime.length} runtime packages.`);
