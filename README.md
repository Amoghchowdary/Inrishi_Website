# INRISHI Website V52

Production frontend source for INRISHI Private Limited.

- Website version: `52.0.0`
- Public visual authority: approved V46/V38 cosmic design, unchanged in V52
- Tagline: `Intelligence inside.`
- Production backend: existing Google Apps Script Web App, unchanged
- Main site: `https://www.inrishi.in`
- Partner origin: `https://partner.inrishi.in`

## V52 purpose

V52 is a security and portal-isolation correction. It does not redesign the approved public website.

### Security correction

- Vite is pinned to `8.3.5`.
- Tailwind/Vite build tooling is isolated in `devDependencies`.
- Unused Zod 3.x and other unused packages are removed from the runtime dependency tree.
- Runtime dependencies are restricted to the packages actually imported by `src/`.
- `npm audit --omit=dev --audit-level=high` is a mandatory preflight gate.

### Partner Portal correction

Main-domain fallback routes:
- `/partner`
- `/partner-login`
- `/partner-register`
- `/partner-portal`

Partner-domain aliases:
- `/`
- `/login`
- `/register`
- `/portal`

The partner website now exposes `Partner Portal` explicitly. The main-site footer also exposes Partner Network and Partner Login fallback links.

### Admin isolation

- The public `/admin` alias is removed.
- Super Admin remains only at the hidden route configured in `public/inrishi-config.js`.
- Partner routes and partner authentication are verified not to import or use admin portal/session code.

## Exit-control gate

`npm run preflight` is the single release gate. It runs configuration validation, dependency policy, design lock, compile guards, route isolation, production audit, TypeScript, production-source checks, UI checks, build, dist verification, and final release verification.

## V52 release integrity

V52 restores `tw-animate-css` 1.4.0 because `src/styles.css` imports it and Radix dialog transitions use its animation utilities. The release gate validates CSS package imports and the compiled production stylesheet. GitHub Actions installs the pinned manifest with strict peer-dependency validation, then reruns the CSS integrity gate against node_modules.
