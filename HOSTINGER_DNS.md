# Hostinger DNS for Inrishi GitHub Pages

Use the DNS zone for `inrishi.in` in Hostinger.

Before editing records, make a DNS-zone backup and preserve existing email-related MX/SPF/DKIM/DMARC records.

## 1. Verify the domain in GitHub first

In your GitHub account/organization Pages settings, add and verify `inrishi.in`.
GitHub will provide a TXT record similar to:

Type: `TXT`
Name: `_github-pages-challenge-YOUR_GITHUB_USERNAME`
Value: `<exact verification value provided by GitHub>`
TTL: `14400` or Hostinger default

Keep the verification TXT record after verification.

## 2. Root domain records

Create these four `A` records:

| Type | Name | Points to |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

Optional/recommended IPv6 records:

| Type | Name | Points to |
|---|---|---|
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |

## 3. Main website

Create:

Type: `CNAME`
Name: `www`
Target: `YOUR_GITHUB_USERNAME.github.io`
TTL: `14400` or Hostinger default

In the main GitHub repository, set the Pages custom domain to:

`www.inrishi.in`

## 4. Partner website

Create:

Type: `CNAME`
Name: `partner`
Target: `YOUR_GITHUB_USERNAME.github.io`
TTL: `14400` or Hostinger default

In the partner GitHub repository, set the Pages custom domain to:

`partner.inrishi.in`

## 5. Root redirect

With GitHub Pages configured for `www.inrishi.in` and the root `inrishi.in` DNS records pointed to GitHub Pages, GitHub can redirect the apex domain to the `www` site.

## Remove conflicts

Remove or replace old website-routing records that conflict with the above:

- old `A`/`AAAA` records for `@` that point to another website host;
- old `A`/`CNAME` records for `www`;
- old `A`/`CNAME` records for `partner`.

Do **not** delete MX/TXT records used by email.
Do **not** create a wildcard `*` record for GitHub Pages.

If Hostinger CDN is enabled for the domain, disable it before changing root/`www` records because Hostinger can lock/replace those DNS records while CDN is active.

DNS propagation can take up to 24 hours.

## HTTPS

After DNS is detected successfully by GitHub, open **Settings → Pages** for each repository and enable **Enforce HTTPS** when the option becomes available.
