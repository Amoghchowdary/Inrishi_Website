# Production Configuration

The browser-visible production configuration is centralized in:

`public/inrishi-config.js`

## Backend endpoint

`https://script.google.com/macros/s/AKfycbzQ1YMIghWp_p3hy3NxsJraffY_AjLA77JlyfYF7YvkGlylLnV2MiDgJViLjByn9ntq/exec`

This URL is a public Web App endpoint identifier. It is not a database credential.

The following remain outside GitHub and are created/stored by Apps Script:

- Google Sheet database ID
- Google Drive folder ID
- password salts/hashes and secret pepper
- session records and verification challenges
- customer records
- partner records
- administrator records
- lead/payment/incentive/project records
- chat and document metadata

## Public origins

- Main: `https://www.inrishi.in`
- Partner: `https://partner.inrishi.in`
- Root domain: `https://inrishi.in` redirects to the main `www` website after Pages/DNS configuration.

## Repository variable

Each GitHub repository needs only one Actions variable:

Main repository:
`SITE_DOMAIN=www.inrishi.in`

Partner repository:
`SITE_DOMAIN=partner.inrishi.in`

The Apps Script URL is already embedded and does not need to be duplicated as a GitHub secret or variable.
