# Inrishi V39 — GitHub Production Frontend

This is the production frontend for the Inrishi platform.

It is designed to be published only through GitHub Actions and GitHub Pages.
It contains no Google Apps Script backend source, no Google Sheet ID, no Drive folder ID, no password hashes, and no customer or partner database records.

## Production domains

- Main website: `https://www.inrishi.in`
- Customer access: `https://www.inrishi.in/customer-login`
- Partner website: `https://partner.inrishi.in`
- Partner access: `https://partner.inrishi.in/login`

The Apps Script Web App endpoint is already embedded in `public/inrishi-config.js`.

## Recommended repository layout

Use two GitHub repositories with the same V39 source:

1. Main website repository — repository variable `SITE_DOMAIN=www.inrishi.in`
2. Partner website repository — repository variable `SITE_DOMAIN=partner.inrishi.in`

The included GitHub Actions workflow builds the source, runs the production acceptance checks, prepares the correct domain-specific sitemap/metadata, and deploys `dist/` to GitHub Pages.

## Push source

```text
npm run push:git -- "https://github.com/YOUR_GITHUB_USERNAME/inrishi-main-site.git" main "Deploy Inrishi main production"
```

For the partner repository, use a second clean copy of this folder and run:

```text
npm run push:git -- "https://github.com/YOUR_GITHUB_USERNAME/inrishi-partner-site.git" main "Deploy Inrishi partner production"
```

No local deployment is required. GitHub Actions is the production build and deployment gate.

## Production documentation

- `PRODUCTION_CUTOVER.md`
- `GITHUB_ACTIONS_DEPLOYMENT.md`
- `HOSTINGER_DNS.md`
- `GIT_PUSH.md`
- `SECURITY_INTEGRATION.md`
- `DEPLOYMENT_CHECKLIST.md`
- `VERIFICATION_REPORT.md`
