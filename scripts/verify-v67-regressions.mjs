import fs from "node:fs";
const errors=[];const must=(ok,msg)=>{if(!ok)errors.push(msg)};const read=p=>fs.readFileSync(p,"utf8");
const pkg=JSON.parse(read("package.json")),vite=read("vite.config.ts"),html=read("index.html"),runtime=read("src/lib/runtime-config.ts"),api=read("src/lib/apps-script-api.ts"),workflow=read(".github/workflows/deploy-pages.yml"),admin=read("src/components/admin-workspace.tsx"),customer=read("src/routes/customer-login.tsx");
must(pkg.version==="67.0.0","package version must be V67.");
must(pkg.devDependencies?.vite==="8.3.5","Vite must stay pinned to 8.3.5.");
must(pkg.devDependencies?.["tw-animate-css"]==="1.4.0","tw-animate-css 1.4.0 must remain declared.");
must(vite.includes('base: "./"')&&!vite.includes('base: "/"'),"Vite relative Pages base regression detected.");
must(html.includes("%BASE_URL%favicon.png")&&html.includes("%BASE_URL%inrishi-config.js"),"BASE_URL production assets missing.");
must(runtime.includes('APP_VERSION: "67.0.0"'),"Runtime fallback is not V67.");
must(api.includes('form.method="POST"')&&api.includes("form.submit()"),"Stable Apps Script form-post transport is missing.");
must(!api.includes("ensureRpcBridge")&&!api.includes("google.script.run"),"Broken persistent RPC bridge returned.");
must(api.includes('host.endsWith("-script.googleusercontent.com")'),"Dynamic Apps Script response origin trust is missing.");
must(admin.includes("changeAdminPasswordFn")&&admin.includes("Change password"),"Admin password-change control missing.");
must(customer.includes("registerRequest")&&customer.includes("referralCode")&&customer.includes("Forgot Customer ID?")&&customer.includes("Forgot Password?"),"Customer registration/recovery controls missing.");
must(workflow.includes("Verify deployed Apps Script backend contract"),"GitHub Actions must verify the declared live backend contract.");
must(!workflow.includes("npm run dev")&&!workflow.includes("vite preview")&&!workflow.includes("localhost"),"Production workflow contains local-development commands.");
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V67 historical-regression gate passed: V50–V63 failure classes, form-event typing and authentication regressions remain blocked.");
