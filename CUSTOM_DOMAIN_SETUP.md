# Custom Domain Configuration Guide for GCVIAS

Your application is deployed and hosted on central cloud edge servers 24 hours a day, 7 days a week, 365 days a year:
- **Live Cloud URL**: [https://jeetron1x.github.io/gcvias-console/](https://jeetron1x.github.io/gcvias-console/)
- **Source Repository**: [https://github.com/jeetron1x/gcvias-console](https://github.com/jeetron1x/gcvias-console)

This cloud deployment is completely independent of your local computer. Even if your PC is powered off, the console remains accessible from any mobile phone, tablet, or remote computer across the globe.

---

## 1. How to Bind Your Custom Domain

You can link any custom domain (e.g., `gcvias.youragency.org` or `cycloneresilience.org`) directly from your GitHub repository settings.

### Step 1: Add Custom Domain in GitHub Pages Settings
1. Open your repository Pages settings:
   [https://github.com/jeetron1x/gcvias-console/settings/pages](https://github.com/jeetron1x/gcvias-console/settings/pages)
2. Under the **Custom domain** section, enter your domain name (e.g., `cyclone.yourdomain.com` or `yourdomain.com`).
3. Click **Save**.

### Step 2: Configure DNS Records at Your Domain Registrar
Log into your DNS provider (Cloudflare, GoDaddy, Namecheap, Google Domains, Route53, etc.) and add the appropriate record:

#### For a Subdomain (Recommended, e.g., `cyclone.yourdomain.com`):
| Type | Host / Name | Target / Value | TTL |
|------|-------------|----------------|-----|
| CNAME | `cyclone` | `jeetron1x.github.io.` | Auto / 300 |

#### For an Apex / Root Domain (e.g., `yourdomain.com`):
Add these 4 **A** records pointing to GitHub global edge IP addresses:
| Type | Host / Name | Value | TTL |
|------|-------------|-------|-----|
| A | `@` | `185.199.108.153` | Auto / 300 |
| A | `@` | `185.199.109.153` | Auto / 300 |
| A | `@` | `185.199.110.153` | Auto / 300 |
| A | `@` | `185.199.111.153` | Auto / 300 |

### Step 3: Enforce HTTPS
Once DNS records propagate (typically 1 to 5 minutes), return to [GitHub Pages Settings](https://github.com/jeetron1x/gcvias-console/settings/pages) and check **Enforce HTTPS**. A free SSL certificate from Let's Encrypt will be issued automatically.

---

## 2. DNS Verification Command

To verify that your custom domain DNS is live from any terminal:

```bash
# Check CNAME record
nslookup -type=CNAME cyclone.yourdomain.com

# Check HTTP status
curl -I https://cyclone.yourdomain.com
```
