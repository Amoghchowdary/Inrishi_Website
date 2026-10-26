# Git Push

The repository helper is implemented in Node, not PowerShell:

`scripts/push-git.mjs`

## Main website repository

From a clean extracted copy of this V39 frontend:

```text
npm run push:git -- "https://github.com/YOUR_GITHUB_USERNAME/inrishi-main-site.git" main "Deploy Inrishi main production"
```

## Partner website repository

Use a second clean extracted copy of the same V39 frontend:

```text
npm run push:git -- "https://github.com/YOUR_GITHUB_USERNAME/inrishi-partner-site.git" main "Deploy Inrishi partner production"
```

The helper initializes Git when necessary, sets `origin`, commits the source and pushes `main`.

GitHub Actions performs the production build and acceptance checks after the push.

Do not upload the separate Apps Script backend ZIP to either Git repository.
