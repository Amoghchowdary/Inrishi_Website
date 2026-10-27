# INRISHI V60 Main production architecture

- Repository: `Amoghchowdary/Inrishi_Website`
- Production domain: `https://www.inrishi.in`
- Responsibilities: public website, Customer access, Customer portal, Super Admin Control Center.
- Partner frontend is not bundled here; Partner links point to `https://partner.inrishi.in`.
- Backend is a separate Google Apps Script deployment outside GitHub and is shared with Partner through a server-enforced site/role/action contract.
- Customer accounts use the customer's own registered Gmail address. INRISHI does not issue a customer email inbox.
- Customer registration and Customer ID/password recovery are OTP-first.
- Admin password changes revoke active Admin sessions.
- Backend transport is per-request Apps Script Web App POST with an HtmlService response bridge; the rejected persistent RPC iframe design is not used.
- GitHub Actions is the production compiler/build/audit/deployment gate.
