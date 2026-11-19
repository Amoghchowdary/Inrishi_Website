# INRISHI Main/Admin V81 Production Release

V81 is the single-production refinish. It removes legacy route recovery and retired route modules, keeps one canonical Main/Admin/Customer frontend, preserves the V80 five-layer SEO work, and adds a terminal custom 404 for every non-whitelisted URL.

## Production topology
- Main: https://www.inrishi.in
- Admin: /admin
- Customer login: /customer-login
- Customer portal: /customer-portal
- Partner: https://partner.inrishi.in
- Backend: Apps Script V64 / contract 64.0.0

## V81 controls
- No hidden duplicate Admin alias.
- Retired service routes physically removed.
- Unknown URLs return the custom hard 404 instead of being rewritten into the SPA.
- Public SEO routes remain crawlable and prerendered.
- Private routes are direct-entry compatible and noindex.
- GitHub Actions rebuilds from a clean dist and verifies HTTP 404 behavior after deployment.
