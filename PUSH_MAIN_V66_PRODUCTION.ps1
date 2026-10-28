$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$Source = "C:\Users\MYPC\Desktop\InRishi\INRISHI_WEBSITE_V66_MAIN"
$Deploy = "C:\Users\MYPC\Desktop\InRishi\Deployment\Inrishi_Website"
$Remote = "https://github.com/Amoghchowdary/Inrishi_Website.git"
$ExpectedFrontend = "66.0.0"
$ExpectedBackend = "62.0.0"

function Assert-File([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "Required file missing: $Path"
    }
}

Write-Host "=== INRISHI Main V66 production handoff ==="
Assert-File "$Source\package.json"
Assert-File "$Source\backend-contract.json"
Assert-File "$Source\.github\workflows\deploy-pages.yml"
Assert-File "$Source\scripts\verify-backend-health.mjs"

$sourcePkg = Get-Content "$Source\package.json" -Raw | ConvertFrom-Json
$sourceContract = Get-Content "$Source\backend-contract.json" -Raw | ConvertFrom-Json
$sourceWorkflow = Get-Content "$Source\.github\workflows\deploy-pages.yml" -Raw

if ($sourcePkg.version -ne $ExpectedFrontend) { throw "Wrong Main source: expected $ExpectedFrontend, found $($sourcePkg.version)." }
if ($sourceContract.version -ne $ExpectedBackend) { throw "Wrong Main backend contract: expected $ExpectedBackend, found $($sourceContract.version)." }
if ($sourceWorkflow -notmatch 'Deploy INRISHI Main V66 Production') { throw "Main V66 workflow identity missing." }
if ($sourceWorkflow -notmatch 'Verify deployed Apps Script backend contract') { throw "Generic backend contract gate missing." }
if ($sourceWorkflow -match 'Verify deployed Apps Script V60 backend|Verify deployed Apps Script V61 backend') { throw "Obsolete hard-coded backend gate detected in Main source." }

if (-not (Test-Path -LiteralPath "$Deploy\.git" -PathType Container)) {
    throw "Persistent Main deployment clone is missing .git: $Deploy"
}

Set-Location $Deploy
git remote set-url origin $Remote
if ($LASTEXITCODE -ne 0) { throw "git remote set-url failed for Main." }
git fetch origin
if ($LASTEXITCODE -ne 0) { throw "git fetch origin failed for Main." }
git reset --hard origin/main
if ($LASTEXITCODE -ne 0) { throw "git reset --hard origin/main failed for Main." }

robocopy $Source $Deploy /MIR /XD ".git" "node_modules" "dist" ".vite" /XF ".env" ".env.local" "*.log"
$robocopyCode = $LASTEXITCODE
if ($robocopyCode -ge 8) { throw "Robocopy failed for Main with exit code $robocopyCode." }

$deployedPkg = Get-Content "$Deploy\package.json" -Raw | ConvertFrom-Json
$deployedContract = Get-Content "$Deploy\backend-contract.json" -Raw | ConvertFrom-Json
$deployedWorkflow = Get-Content "$Deploy\.github\workflows\deploy-pages.yml" -Raw
if ($deployedPkg.version -ne $ExpectedFrontend) { throw "Main deployment clone is not V66 after Robocopy." }
if ($deployedContract.version -ne $ExpectedBackend) { throw "Main deployment clone backend contract is not V62." }
if ($deployedWorkflow -notmatch 'Deploy INRISHI Main V66 Production') { throw "Old Main workflow remains after Robocopy." }

Write-Host "--- Main diff before commit ---"
git status
git diff --stat
git diff -- .github/workflows/deploy-pages.yml backend-contract.json scripts/verify-backend-health.mjs package.json

git add -A
if ($LASTEXITCODE -ne 0) { throw "git add failed for Main." }

$stagedPkg = (git show :package.json | Out-String) | ConvertFrom-Json
$stagedContract = (git show :backend-contract.json | Out-String) | ConvertFrom-Json
$stagedWorkflow = git show :.github/workflows/deploy-pages.yml | Out-String
if ($stagedPkg.version -ne $ExpectedFrontend) { throw "Staged Main package is not V66." }
if ($stagedContract.version -ne $ExpectedBackend) { throw "Staged Main contract is not V62." }
if ($stagedWorkflow -notmatch 'Deploy INRISHI Main V66 Production') { throw "Staged Main workflow is not V66." }
if ($stagedWorkflow -match 'Verify deployed Apps Script V60 backend|Verify deployed Apps Script V61 backend') { throw "Old Main backend gate is still staged." }

git diff --cached --quiet
$stagedDiffCode = $LASTEXITCODE
if ($stagedDiffCode -eq 0) { throw "No Main V66 changes are staged. Refusing to claim a production push." }
if ($stagedDiffCode -ne 1) { throw "Unable to inspect staged Main changes." }

git commit -m "Deploy INRISHI Main V66 production"
if ($LASTEXITCODE -ne 0) { throw "Main commit failed." }
git push origin main
if ($LASTEXITCODE -ne 0) { throw "Main push failed." }

git fetch origin
if ($LASTEXITCODE -ne 0) { throw "Main post-push fetch failed." }
$localHead = (git rev-parse HEAD).Trim()
$remoteHead = (git rev-parse origin/main).Trim()
if ($localHead -ne $remoteHead) { throw "Main push verification failed: local HEAD and origin/main differ." }

$remotePkg = (git show origin/main:package.json | Out-String) | ConvertFrom-Json
$remoteContract = (git show origin/main:backend-contract.json | Out-String) | ConvertFrom-Json
$remoteWorkflow = git show origin/main:.github/workflows/deploy-pages.yml | Out-String
if ($remotePkg.version -ne $ExpectedFrontend) { throw "origin/main Main package is not V66." }
if ($remoteContract.version -ne $ExpectedBackend) { throw "origin/main Main contract is not V62." }
if ($remoteWorkflow -notmatch 'Deploy INRISHI Main V66 Production') { throw "origin/main Main workflow is not V66." }
if ($remoteWorkflow -match 'Verify deployed Apps Script V60 backend|Verify deployed Apps Script V61 backend') { throw "origin/main still contains an obsolete Main backend gate." }

Write-Host "SUCCESS: Main origin/main is V66 and targets Apps Script contract V62. GitHub Actions now owns acceptance/build/deployment."
