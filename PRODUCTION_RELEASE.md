# INRISHI Main V66 Production Release

V66 is the coordinated production-integration release for the INRISHI Main frontend. The approved public design remains unchanged.

Production alignment:
- Main frontend release: 66.0.0;
- Partner frontend release: 66.0.0;
- shared Google Apps Script backend contract: 62.0.0;
- stable Apps Script Web App form-POST transport;
- Admin sign-in, OTP, password change and Control Center preserved;
- Customer Gmail registration, OTP verification and recovery preserved;
- Main and Partner use the same 72-action backend contract;
- GitHub Pages route recovery, security gates and post-deploy smoke testing remain enforced.

GitHub Actions is the production build/deployment acceptance environment. Frontend release numbers are intentionally independent from the Apps Script backend contract version.
