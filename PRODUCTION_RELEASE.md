# INRISHI Main V76 Production Release

V76 is a visual storytelling and UI refinement release. It preserves the V63 backend, authentication and production topology while simplifying public navigation and increasing visual product explanation.

Production requirements:
- frontend 76.0.0;
- backend contract 63.0.0;
- www.inrishi.in custom domain;
- GitHub Actions live-backend gate before build/deploy;
- no local-development step in production workflow.

## V76 analytics
Google Tag Manager is connected using `GTM-WSCMN3T2` on the Main site. The release gate verifies the container ID before production build/deployment.
