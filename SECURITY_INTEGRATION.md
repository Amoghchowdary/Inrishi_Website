# Frontend/backend security boundary

GitHub Pages hosts only the frontend application. Private operational data stays behind the Google Apps Script Web App and its Google Sheets/Drive storage.

The frontend repository contains no Sheet ID, Drive folder ID, password pepper, password hashes, customer database, partner database or Apps Script backend source. Customer, partner and administrator operations use authenticated backend sessions.
