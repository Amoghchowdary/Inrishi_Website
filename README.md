# INRISHI Main + Admin V81

Production frontend for https://www.inrishi.in.

V81 is the Admin/Customer reliability and portal-UX release paired with Apps Script V64. It preserves the public storytelling direction, optimized media and GTM while fixing the operational failures reported from production.

## V81 fixes
- Admin Partners view tolerates legacy records with missing arrays instead of rendering a blank panel.
- Partner and Customer lists are searchable and expose onboarding/login delivery status.
- Admin can resend Partner application acknowledgements, resend Partner credentials/documents and send/reset Customer credentials.
- Customer access failures caused by missing historical auth identities have a supported recovery path.
- Admin workspace uses a cached snapshot with silent refresh for faster navigation.
- Admin tabs persist in the URL hash; desktop navigation is sticky and mobile navigation is a horizontal sticky scroller.
- Frontend contract requires Apps Script V64 / 64.0.0 / 74 actions.
- Main GTM remains GTM-WSCMN3T2.

## Production rule
Deploy Apps Script V64 first. V81 GitHub Actions intentionally blocks if the live backend is not 64.0.0.
