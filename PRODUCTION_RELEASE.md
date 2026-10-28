# INRISHI Main V63 Production Release

V63 is a functionality-stabilization release. The approved public design is unchanged.

Production corrections:
- stable Apps Script Web App POST transport restored;
- Admin sign-in transport repaired;
- Admin Security includes authenticated password change;
- customers register with their own Gmail after OTP verification;
- Forgot Customer ID and Forgot Password are OTP-first;
- Customer Settings includes password change;
- customers converted from Partner leads must provide their own valid Gmail;
- no customer pseudo-email/inbox is issued by INRISHI;
- GitHub Pages path/recovery and V50-V59 regression controls remain locked.

GitHub Actions is the only production build/deployment acceptance environment.
