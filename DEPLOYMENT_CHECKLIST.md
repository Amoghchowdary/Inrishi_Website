# Production Deployment Checklist

## Backend
- [ ] V39 `Code.gs`, `Auth.gs`, and `appsscript.json` are saved in the Apps Script project.
- [ ] `setupInrishiBackend()` completed.
- [ ] `finalizeProductionBackend()` completed once.
- [ ] Super Admin `inrishiprivatelimited@gmail.com` exists.
- [ ] `verifyInrishiBackend()` returns `ok: true`.
- [ ] Existing Web App deployment was updated to a new version and retained the configured `/exec` URL.
- [ ] Sheets, Drive and email permissions were approved.

## GitHub — main
- [ ] Main repository created.
- [ ] V39 frontend pushed to `main`.
- [ ] Actions variable `SITE_DOMAIN=www.inrishi.in` created.
- [ ] GitHub Actions deployment succeeded.
- [ ] Pages custom domain is `www.inrishi.in`.

## GitHub — partner
- [ ] Partner repository created.
- [ ] V39 frontend pushed to `main`.
- [ ] Actions variable `SITE_DOMAIN=partner.inrishi.in` created.
- [ ] GitHub Actions deployment succeeded.
- [ ] Pages custom domain is `partner.inrishi.in`.

## Hostinger DNS
- [ ] `inrishi.in` verified in GitHub with the GitHub-provided TXT record.
- [ ] Four GitHub Pages A records added for `@`.
- [ ] Optional/recommended four AAAA records added for `@`.
- [ ] `www` CNAME points to `YOUR_GITHUB_USERNAME.github.io`.
- [ ] `partner` CNAME points to `YOUR_GITHUB_USERNAME.github.io`.
- [ ] Conflicting old root/www/partner website records removed.
- [ ] Existing email MX/SPF/DKIM/DMARC records preserved.
- [ ] No wildcard `*` record used for GitHub Pages.
- [ ] Hostinger CDN disabled if it was managing root/`www` records.
- [ ] HTTPS enforced in both GitHub Pages repositories after DNS validation.

## Live functionality
- [ ] Main website and Partner website render correctly.
- [ ] Contact/inquiry form reaches Super Admin.
- [ ] Customer authentication works.
- [ ] Partner registration/approval/login/email verification works.
- [ ] Partner lead → first payment → customer conversion works.
- [ ] Customer login delivery email works.
- [ ] Customer and Partner document access works.
- [ ] Super Admin modules remain separated by business function.
