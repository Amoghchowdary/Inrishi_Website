# GitHub Actions Deployment

V39 uses `.github/workflows/deploy-pages.yml` as the production deployment path.

## Repository 1 — Main website

Create a repository such as:

`inrishi-main-site`

In GitHub:

1. Open **Settings → Secrets and variables → Actions → Variables**.
2. Add `SITE_DOMAIN` with value `www.inrishi.in`.
3. Open **Settings → Pages**.
4. Use GitHub Actions as the Pages publishing source.
5. After the first successful workflow, set the custom domain to `www.inrishi.in` and save it.

## Repository 2 — Partner website

Create a second repository such as:

`inrishi-partner-site`

Add repository variable:

`SITE_DOMAIN=partner.inrishi.in`

Then configure **Settings → Pages** and set the custom domain to `partner.inrishi.in`.

## What the deployment workflow does

On every push to `main`, the workflow:

1. checks out the source;
2. installs dependencies;
3. requires `SITE_DOMAIN`;
4. runs the full production preflight (`configuration → TypeScript → frontend security checks → build → built-output checks`);
5. generates the correct canonical metadata, sitemap, robots file and `.nojekyll` for the configured domain;
6. uploads `dist/` as the GitHub Pages artifact;
7. deploys it with GitHub Pages Actions.

A failed production check stops deployment.

## Important custom-domain rule

The project uses a custom GitHub Actions Pages workflow. Custom-domain ownership/routing must be configured in the repository's **Settings → Pages**. A `CNAME` file is intentionally not used by this package.

## Dependency security gate

Both the deployment and pull-request workflows run `npm run audit:prod`. A high-severity vulnerability in a production dependency blocks the workflow before deployment.
