# Inrishi Production Cutover

Follow this sequence once.

## A. Apps Script backend

1. Replace the Apps Script project files with the separate V39 backend package (`Code.gs`, `Auth.gs`, `appsscript.json`).
2. Save all three files.
3. Run `setupInrishiBackend()`.
4. Run `finalizeProductionBackend()` once. This removes old test seed accounts/challenges/sessions and applies production origins.
5. Run `createAdminLogin()`. It is safe to run if the Super Admin already exists; it will not create a duplicate.
6. If you no longer know the Super Admin password, run `resetAdminCredentials()` and save the one-time password shown in the execution log.
7. Run `verifyInrishiBackend()` and confirm `ok: true` and production origins only.
8. Update the existing Web App deployment to a **new version** rather than creating a different deployment ID, so the current `/exec` URL remains unchanged.
9. Approve the Google permissions required by Sheets, Drive and email delivery.

## B. GitHub repositories

1. Create one repository for the main site and one for the partner site.
2. Push the same V39 frontend source to both repositories using `npm run push:git`.
3. Add `SITE_DOMAIN=www.inrishi.in` to the main repository Actions variables.
4. Add `SITE_DOMAIN=partner.inrishi.in` to the partner repository Actions variables.
5. Let the GitHub Actions deployment complete successfully.
6. Configure each repository's Pages custom domain.

## C. GitHub domain verification and Hostinger DNS

1. Verify `inrishi.in` in GitHub Pages domain settings and add the supplied TXT record in Hostinger.
2. Add GitHub's root A/AAAA records.
3. Add `www` CNAME → `YOUR_GITHUB_USERNAME.github.io`.
4. Add `partner` CNAME → `YOUR_GITHUB_USERNAME.github.io`.
5. Remove only conflicting website-routing records; preserve mail records.
6. Wait for DNS propagation.
7. Enable **Enforce HTTPS** in both GitHub Pages repositories when available.

## D. Production acceptance

Confirm:

- `https://www.inrishi.in` loads the main Inrishi website.
- `https://inrishi.in` redirects to the main website.
- `https://partner.inrishi.in` loads the Partner website.
- customer login reaches the Apps Script backend.
- partner registration writes to the Sheets database.
- partner password verification code is delivered by email.
- the 50% first-payment rule blocks conversion until satisfied.
- converted customers appear in both Partner and Super Admin views.
- customer login details are emailed from Apps Script and no plaintext password remains in shared records.
- website inquiries appear in Super Admin.
- documents upload to Drive and open only for authorized accounts.
- no WhatsApp, Lovable, local/test credentials or developer-facing setup text appears on the live sites.
