# Production Security Architecture

## Data boundary

GitHub Pages serves only the frontend application.

Private operational data is not stored in the Git repository. The production data path is:

GitHub Pages frontend → Apps Script Web App → Google Sheets / Google Drive

Google Sheets stores account and business records. Google Drive stores uploaded file content. Apps Script Script Properties hold backend-only configuration such as the Sheet ID, Drive folder ID and password pepper.

## Authentication

- Super Admin: administrator email + password.
- Customer: Inrishi Customer Login ID + password.
- Partner: Inrishi Partner Login ID + password + verification code delivered to the registered recovery email.
- Partner password recovery uses email verification.
- Passwords are stored only as salted/peppered hashes in the backend.
- Privileged operations require an authenticated role/session at the Apps Script layer.

## Production customer login delivery

When a partner converts a qualified lead after the required first payment:

1. The backend creates the customer and project records.
2. A customer Login ID is allocated.
3. No plaintext customer password is stored in the shared customer record.
4. When the partner chooses **Send login details**, Apps Script generates a new one-time temporary password.
5. The password is hashed immediately.
6. Apps Script emails the Login ID and temporary password to the customer's registered contact email.
7. Only delivery status remains in the partner/customer records.

## Uploaded documents

File content is sent to Apps Script and stored in Google Drive. The database stores metadata and ownership information. Access checks are performed by Apps Script before files are returned or removed.

## Source-code exposure

GitHub Pages frontend code can be inspected by visitors. Therefore no backend secret, private data, Sheet ID, Drive ID, password hash, or Apps Script source is included in this package.
