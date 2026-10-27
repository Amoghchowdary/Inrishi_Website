import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const errors = [];
const version = (name, group) => pkg[group]?.[name] ?? "";
const parts = (value) => String(value).replace(/^[^0-9]*/, "").split(".").map((n) => Number.parseInt(n, 10) || 0);
const atLeast = (value, target) => {
  const a = parts(value); const b = parts(target);
  for (let i = 0; i < 3; i += 1) {
    if ((a[i] ?? 0) > (b[i] ?? 0)) return true;
    if ((a[i] ?? 0) < (b[i] ?? 0)) return false;
  }
  return true;
};
const vite = version("vite", "devDependencies");
const tailwindVite = version("@tailwindcss/vite", "dependencies");
const tailwind = version("tailwindcss", "dependencies");
const reactPlugin = version("@vitejs/plugin-react", "devDependencies");
if (pkg.name !== "inrishi-website-v46-production") errors.push("Unexpected package name.");
if (pkg.version !== "46.0.0") errors.push("V46 package version must be 46.0.0.");
if (vite !== "8.1.5") errors.push("Vite must remain pinned to 8.1.5.");
if (!atLeast(tailwindVite, "4.3.0")) errors.push("@tailwindcss/vite must be 4.3.0 or newer for Vite 8.");
if (tailwindVite !== tailwind) errors.push("@tailwindcss/vite and tailwindcss must use the same pinned version.");
if (!atLeast(reactPlugin, "5.2.0")) errors.push("@vitejs/plugin-react must be 5.2.0 or newer.");
if (!pkg.engines?.node?.includes("22.12.0")) errors.push("Node production engine floor must remain 22.12.0.");
const viteConfig = fs.readFileSync("vite.config.ts", "utf8");
if (/minify\s*:\s*["\']esbuild["\']/.test(viteConfig)) errors.push("Vite 8 must not use deprecated esbuild minification. Use Oxc.");
if (!/minify\s*:\s*["\']oxc["\']/.test(viteConfig)) errors.push("Vite 8 production minifier must be Oxc.");
for (const forbidden of ["dev","preview","start","push:git","configure"]) if (pkg.scripts?.[forbidden]) errors.push(`Production package must not expose script: ${forbidden}`);
if (errors.length) { console.error(errors.map((e)=>`ERROR: ${e}`).join("\n")); process.exit(1); }
console.log(`Dependency manifest verified: Vite ${vite}, Tailwind Vite ${tailwindVite}, React plugin ${reactPlugin}.`);
