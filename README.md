# Geospatial Cyclone Vulnerability & Infrastructure Assessment System (GCVIAS)

An institutional command console engineered for State Disaster Management Authorities (SDMAs), District Emergency Operations Centers (DEOCs), and Municipal Incident Commanders to evaluate cyclone landfall trajectories, quantify infrastructure exposure in real time across the timeline, and generate actionable multilingual evacuation advisories.

---

## 1. System Features & Architecture

- **Interactive GIS Command Viewport**: Dynamic uncertainty cones, right-front quadrant Coriolis surge hazard buffers, and clustered infrastructure nodes (Leaflet with Carto Dark Matter, ESRI Satellite, and OpenStreetMap basemaps).
- **Timeline Simulation Scrubber**: Precision 6-hour interval timeline control (T-48h to T+36h) driving live spatial polygon updates and exposure calculations.
- **Exposure Assessment Queue**: Live counts of exposed 220kV/132kV/33kV substations, multipurpose cyclone shelters, primary health centres, and coastal highways.
- **Multilingual Evacuation Advisory Engine**: Generates structured disaster directives across 6 coastal languages (English, Odia, Bengali, Telugu, Tamil, Hindi) with client-side acoustic alert tone synthesis and Web Speech API broadcast playback.
- **Official Situation Report (SitRep)**: Standardized print format compliant with national disaster reporting standards and JSON-exportable audit logs.
- **Infrastructure Registry**: Searchable, filterable technical catalog with CSV export and map location cross-referencing.
- **Full Legal & Governance Compliance**: Institutional Privacy Policy (`/privacy`) and Terms & Conditions (`/terms`).

---

## 2. 24/7 Central Cloud Deployment (Independent of Local PC)

To ensure the console remains permanently online and accessible on mobile phones, tablets, or remote computers without requiring your local PC to be running, use the following production deployment pathway.

### The Best & Recommended Deployment: Vercel Cloud Edge

Vercel provides free, globally distributed edge server hosting with zero downtime, instant SSL certificates, and 1-click custom domain routing.

#### Step 1: Launch Cloud Deployment
In your PowerShell or terminal in the project directory, execute:
```powershell
.\deploy.ps1
```
*(Or run `npm run deploy`)*

#### Step 2: Authenticate (10 Seconds)
The CLI will open your default browser to verify your free Vercel account. Once authenticated, Vercel immediately compiles and deploys the project to global edge servers.

#### Step 3: Bind Your Custom Domain
1. Open the [Vercel Dashboard](https://vercel.com/dashboard) and select your `gcvias-console` project.
2. Navigate to **Settings** > **Domains**.
3. Enter your custom domain (e.g., `cyclone.youragency.org` or `yourdomain.com`).
4. In your DNS provider (Cloudflare, GoDaddy, Namecheap, etc.), add the appropriate record:
   - For a subdomain (e.g., `cyclone.yourdomain.com`): Add a **CNAME** record pointing to `cname.vercel-dns.com`.
   - For an apex domain (e.g., `yourdomain.com`): Add an **A** record pointing to `76.76.21.21`.
5. Your custom domain will be active with automated SSL in less than 2 minutes.

---

## 3. Alternative 24/7 Hosting Options

### Option B: Cloudflare Pages / GitHub Pages
The repository includes `.github/workflows/deploy.yml` and `CNAME`.
1. Push this repository to GitHub:
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/gcvias.git
   git push -u origin main
   ```
2. In Cloudflare Pages, connect the repository, select the `Vite` preset, and deploy. Cloudflare will host the application 24/7 across 300+ edge locations.

### Option C: Containerized Central Server (Docker / Linux VPS / AWS / Render)
The project includes a multi-stage `Dockerfile`, `docker-compose.yml`, and a native `server.js` production HTTP server with SPA routing.
```bash
# On your Linux cloud server / VPS:
docker compose up -d
```
Or with PM2:
```bash
npm run build
pm2 start server.js --name gcvias
```

---

## 4. Design Standards & Compliance

- Zero purple gradients or artificial styling tropes.
- Zero pill-shaped buttons (tactical radii `rounded-md` 4px/6px only).
- Zero fake reviews, fake ratings, or synthetic counters.
- Zero emoji icons (strict SVG vector icons via `lucide-react`).
- Zero em dashes across all code, UI copy, and legal documents.
- Zero AI-generated slop imagery.
- Zero hackathon or third-party AI tags.
