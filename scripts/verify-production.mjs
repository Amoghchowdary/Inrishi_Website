import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const allowUnconfigured = process.argv.includes('--allow-unconfigured');
const errors = [];
const required = [
  'index.html','public/404.html','public/inrishi-config.js','src/main.tsx',
  'src/lib/apps-script-api.ts','src/lib/business-api.ts',
  '.github/workflows/deploy-pages.yml','.github/workflows/quality.yml',
  'GITHUB_ACTIONS_DEPLOYMENT.md','HOSTINGER_DNS.md','GIT_PUSH.md','PRODUCTION_CUTOVER.md','SECURITY_INTEGRATION.md'
];
for (const f of required) if (!fs.existsSync(path.join(root,f))) errors.push(`Missing ${f}`);
if (fs.existsSync(path.join(root,'apps-script'))) errors.push('Backend source must not be present in the GitHub frontend package.');
if (fs.existsSync(path.join(root,'src/server'))) errors.push('Server/backend source directory must not be present in the frontend package. Use frontend service adapters only.');
// Production Git package uses npm/Node automation only. PowerShell helper scripts are forbidden.
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.toLowerCase().endsWith('.ps1')) errors.push(`PowerShell script must not be present: ${entry.name}`);
}

for (const doc of ['README.md','CONFIGURATION.md','DEPLOYMENT_CHECKLIST.md','GITHUB_ACTIONS_DEPLOYMENT.md','HOSTINGER_DNS.md','GIT_PUSH.md','PRODUCTION_CUTOVER.md','SECURITY_INTEGRATION.md']) {
  const full = path.join(root, doc);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, 'utf8');
  if (/localhost|partner\.localhost|npm\s+run\s+dev|RUN_V\d+|\.ps1/i.test(text)) errors.push(`Local/development instruction remains in production document: ${doc}`);
}

const pkg = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
if (pkg.dependencies?.['@tanstack/react-start'] || pkg.dependencies?.nitro || pkg.devDependencies?.['@tanstack/react-start']) errors.push('Server runtime dependencies remain in package.json.');

if (pkg.scripts?.dev || pkg.scripts?.preview || pkg.scripts?.start || pkg.scripts?.configure) errors.push('Local development/deployment scripts must not be present in the production package.');
const config = fs.readFileSync(path.join(root,'public/inrishi-config.js'),'utf8');
for (const requiredConfigToken of ['APPS_SCRIPT_URL','MAIN_ORIGIN','PARTNER_ORIGIN','PORTALS','customerLogin','customerPortal','adminEntry','login','register','portal']) {
  if (!config.includes(requiredConfigToken)) errors.push(`Combined runtime config is missing ${requiredConfigToken}.`);
}
if (!allowUnconfigured && config.includes('__APPS_SCRIPT_WEB_APP_URL__')) errors.push('Apps Script URL is not configured. Run npm run configure:backend -- "<exec-url>".');
const textExtensions = new Set(['.ts','.tsx','.js','.jsx','.mjs','.html','.css','.md','.json','.yml','.yaml']);
const skipDirs = new Set(['node_modules','dist','.git']);
const secretPatterns = [
  /INRISHI_DB_SPREADSHEET_ID/i,
  /INRISHI_FILES_FOLDER_ID/i,
  /PASSWORD_PEPPER/i,
  /DriveApp\./,
  /SpreadsheetApp\./,
  /PropertiesService\./,
  /function\s+setupInrishiBackend\s*\(/,
  /amoghchowdaryamaraneni@gmail\.com/i
];
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(skipDirs.has(entry.name)) continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(full);
    else {
      if (path.extname(entry.name).toLowerCase()==='.gs') errors.push(`Apps Script source found in frontend: ${path.relative(root,full)}`);
      if(textExtensions.has(path.extname(entry.name).toLowerCase())) {
        const t=fs.readFileSync(full,'utf8');
        if(/wa\.me|whatsapp/i.test(t)) errors.push(`WhatsApp reference remains in ${path.relative(root,full)}`);
        if(/localhost/i.test(t)) errors.push(`Localhost reference remains in deployable source: ${path.relative(root,full)}`);
        if(/Testing credentials|Test OTP|Test login|for testing only|Reset all testing data/i.test(t)) errors.push(`Testing UI/reference remains in deployable source: ${path.relative(root,full)}`);
        if(/localStorage/.test(t)) errors.push(`Persistent browser data storage remains in deployable source: ${path.relative(root,full)}`);
        for (const pattern of secretPatterns) if(pattern.test(t)) errors.push(`Backend-only code or secret identifier found in ${path.relative(root,full)}`);
      }
    }
  }
}
walk(path.join(root,'src'));
walk(path.join(root,'public'));
walk(path.join(root,'.github'));
if (errors.length) { console.error([...new Set(errors)].map(e=>`ERROR: ${e}`).join('\n')); process.exit(1); }
console.log('Frontend-only production verification passed.');
