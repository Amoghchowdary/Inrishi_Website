# INRISHI Main Production — V70

Production frontend for `https://www.inrishi.in`.

- GitHub repository: `Amoghchowdary/Inrishi_Website`
- Main routes: `/`, `/contact`, `/sample-work`, `/customer-login`, `/customer-portal`, `/admin`
- Partner site: `https://partner.inrishi.in` (separate frontend repository)
- Backend: separate Google Apps Script Web App; no `.gs` backend source belongs in this repository.
- Customer identity: customer's own registered Gmail + generated Customer ID; OTP-first registration/recovery.
- Admin: authenticated Control Center with password change and centralized Customer/Partner/project management.
- GitHub Actions performs backend-version check, strict TypeScript, dependency audits, production build, dist verification, Pages deployment and post-deploy smoke test.
