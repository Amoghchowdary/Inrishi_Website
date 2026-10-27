import fs from "node:fs";

const errors = [];
const cosmic = fs.readFileSync("src/components/cosmic-environment.tsx", "utf8");
const partnerLogin = fs.readFileSync("src/routes/partner-login.tsx", "utf8");
const partnerRegister = fs.readFileSync("src/routes/partner-register.tsx", "utf8");
const api = fs.readFileSync("src/lib/apps-script-api.ts", "utf8");
const vite = fs.readFileSync("vite.config.ts", "utf8");

const must = (ok, message) => { if (!ok) errors.push(message); };

must(cosmic.includes("const activeCanvas: HTMLCanvasElement = canvasElement;"), "Cosmic canvas must use a stable non-null HTMLCanvasElement alias.");
must(cosmic.includes("const ctx: CanvasRenderingContext2D = maybeContext;"), "Cosmic context must use a stable non-null CanvasRenderingContext2D alias.");
must(!/\bcanvas\.(?:width|height|style)\b/.test(cosmic), "Nullable canvas ref is still accessed inside callbacks.");
must(partnerLogin.includes('import { Button } from "@/components/ui/button";'), "Partner Login Button import is missing.");
must(partnerRegister.includes('import { Button } from "@/components/ui/button";'), "Partner Register Button import is missing.");
must(api.includes("code:string|undefined") || api.includes("code: string | undefined"), "AppsScriptBackendError strict optional-property fix is missing.");
must(!vite.includes('minify: "esbuild"'), "Vite must not use the deprecated esbuild minifier path.");
must(vite.includes('minify: "oxc"'), "Vite Oxc minifier setting is missing.");

if (errors.length) {
  console.error(errors.map((e) => `ERROR: ${e}`).join("\n"));
  process.exit(1);
}
console.log("V46 compile regression guards passed.");
