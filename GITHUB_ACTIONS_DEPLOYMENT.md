# GitHub Actions deployment

`.github/workflows/deploy-pages.yml` is the production deployment workflow.

On a push to `main` it:
1. validates the dependency manifest;
2. installs strict peer dependencies;
3. confirms the installed dependency tree;
4. runs the complete `npm run preflight` release gate;
5. prepares the custom-domain Pages output;
6. publishes `dist/` to GitHub Pages.

V52 pins Vite to `8.3.5`, keeps `@tailwindcss/vite` / `tailwindcss` at `4.3.3`, and treats all build tooling as development-only dependencies. The production audit is owned by `preflight` so local testing and GitHub Actions execute the same security gate.
