# INRISHI V61 Production Architecture

## Production boundaries

- Main frontend: `Amoghchowdary/Inrishi_Website` -> `https://www.inrishi.in`
- Partner frontend: `Amoghchowdary/Inrishi_Partner` -> `https://partner.inrishi.in`
- Backend: separate Google Apps Script project using the existing `/exec` deployment URL. Backend `.gs` source is never copied into either public frontend repository.
- Shared business database: Google Sheets/Drive controlled by Apps Script.
- Chat: client-side RSA-OAEP/AES-GCM encryption. Apps Script persists ciphertext/metadata and encrypted attachment blobs only.

## Identity model

- Admin: real administrator email; password + mandatory OTP every login.
- Customer: customer's own Gmail; password + mandatory OTP every login.
- Partner: Partner Login ID + registered recovery email; password + mandatory OTP every login.
- Temporary credentials force a permanent password after verified first login.

## Partner commercial workflow

Lead -> eligible service -> qualifying customer payment -> Customer conversion -> incentive eligible -> Admin approved -> paid. A lead alone does not create an incentive.

## SEO boundary

Public Main/service/Partner-program content is indexable. Admin, Customer auth/portal, Partner login/register/portal remain private/noindex/disallowed.
