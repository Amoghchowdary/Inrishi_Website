import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runtimePath = path.join(root, "src/lib/runtime-config.ts");
const runtimeText = fs.readFileSync(runtimePath, "utf8");
const errors = [];

const exported = new Set();
for (const match of runtimeText.matchAll(/export\s+(?:const|function|class|type|interface)\s+([A-Za-z_$][\w$]*)/g)) {
  exported.add(match[1]);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.(?:ts|tsx)$/.test(entry.name) || full === runtimePath) continue;
    const text = fs.readFileSync(full, "utf8");
    const re = /import\s*\{([^}]+)\}\s*from\s*["']@\/lib\/runtime-config["']/g;
    let match;
    while ((match = re.exec(text))) {
      for (const part of match[1].split(",")) {
        const imported = part.trim().split(/\s+as\s+/)[0]?.trim();
        if (imported && !exported.has(imported)) {
          errors.push(`${path.relative(root, full)} imports missing runtime-config export: ${imported}`);
        }
      }
    }
  }
}

walk(path.join(root, "src"));

for (const required of ["getRuntimeConfig", "isBackendConfigured", "runtimeConfig", "InrishiRuntimeConfig"]) {
  if (!exported.has(required)) errors.push(`runtime-config.ts missing required export: ${required}`);
}

const runtime = fs.readFileSync(runtimePath, "utf8");
const backend = "https://script.google.com/macros/s/AKfycbzQ1YMIghWp_p3hy3NxsJraffY_AjLA77JlyfYF7YvkGlylLnV2MiDgJViLjByn9ntq/exec";
if (!runtime.includes(backend)) errors.push("runtime-config.ts lost the approved Apps Script fallback endpoint.");

if (errors.length) {
  console.error(errors.map(e => `ERROR: ${e}`).join("\n"));
  process.exit(1);
}
console.log(`V60 runtime-config API integrity passed: ${exported.size} export(s) available and all imports resolve.`);
