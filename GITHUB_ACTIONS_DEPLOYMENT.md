# GitHub Actions deployment

`.github/workflows/deploy-pages.yml` is the production deployment workflow.

On a push to `main` it validates the dependency manifest, installs strict peer dependencies, confirms the installed tree, audits production dependencies, runs the production acceptance checks, builds the website, validates the output and deploys `dist/` to GitHub Pages.

The V46 dependency set keeps Vite 8.1.5 and uses `@tailwindcss/vite` / `tailwindcss` 4.3.3 for the Vite 8 production build.
