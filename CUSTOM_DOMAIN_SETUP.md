# Custom Domain Configuration Guide for GCVIAS

This guide provides step-by-step instructions to bind a custom domain (e.g., `gcvias.youragency.org` or `cycloneresilience.in`) to the GCVIAS production deployment.

---

## 1. Domain Architecture Overview

GCVIAS is prepared for static or edge routing with automated HTTPS provisioning through modern edge hosts (Vercel, Cloudflare Pages, Netlify, or GitHub Pages).

- Configuration file for custom apex/subdomain: `CNAME` (present in repository root)
- Edge rewrite and security header manifest: `vercel.json` (present in repository root)
- Static entrypoint: `index.html` with explicit canonical path resolution

---

## 2. DNS Record Configuration

### Option A: Subdomain Setup (Recommended for Institutional Portals)
Example: `gcvias.resilience.gov.in` or `cyclone.agency.org`

| Record Type | Host / Name | Value / Target | TTL |
|-------------|-------------|----------------|-----|
| CNAME | `gcvias` (or your subdomain) | `cname.vercel-dns.com.` (or edge provider CNAME) | 300 / Auto |

### Option B: Apex / Root Domain Setup
Example: `cycloneresilience.org`

| Record Type | Host / Name | Value / Target | TTL |
|-------------|-------------|----------------|-----|
| A | `@` | `76.76.21.21` (Vercel IP 1) | 300 / Auto |
| CNAME | `www` | `cname.vercel-dns.com.` | 300 / Auto |

---

## 3. Deployment Steps

### Vercel Deployment
1. Connect your repository to the Vercel dashboard.
2. Navigate to **Project Settings** > **Domains**.
3. Enter your custom domain (e.g., `gcvias.youragency.org`).
4. Vercel automatically validates the DNS records and provisions an SSL/TLS certificate via Let's Encrypt.
5. The `vercel.json` file in this repository ensures correct client-side SPA routing and sets strict security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`).

### Cloudflare Pages Deployment
1. Connect repository in Cloudflare Dashboard under **Workers & Pages**.
2. Build command: `npm run build`
3. Build output directory: `dist`
4. In Cloudflare Pages project settings, add **Custom Domain**. Cloudflare will handle DNS proxying and Universal SSL automatically.

### GitHub Pages Deployment
1. Update `CNAME` with your exact custom domain name.
2. In your GitHub repository settings, go to **Pages** > **Custom domain** and input the domain.
3. Check the **Enforce HTTPS** box once DNS records propagate.

---

## 4. Verification & Diagnostics

To verify your DNS propagation from your workstation terminal:

```bash
# Check CNAME record
nslookup -type=CNAME gcvias.youragency.org

# Verify HTTP/2 and SSL status
curl -I https://gcvias.youragency.org
```
