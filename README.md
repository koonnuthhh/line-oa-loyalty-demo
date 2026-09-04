# LINE OA Multi-Brand Loyalty & Wi-Fi Platform

Two NestJS services powering a **LINE Official Account (LINE OA) engagement platform for a multi-brand automotive dealership group**. Customers chat with brand bots on LINE to browse promotions, book test drives, find service centers, and request shop **Wi-Fi credentials** that are issued and managed through a LIFF web app.

> **Portfolio copy** — brand names, business data, media assets, and configuration have been fictionalized/removed. Original brands map to fictional ones (Aurora, Verdant, Zephyr, Vector, Meridian, Nimbus). All branch/center rows, phone numbers, and secrets are demo placeholders.

---

## 🧩 What it does

Six LINE bots (one per automotive brand) share one backend and behave per-brand through a config-driven router:

- **Rich menus & promotions** — per-brand menu handling, postback routing, promotion carousels
- **Service-center finder** — branch/center lookup with map links from static data
- **Test-drive booking** — guided Q&A conversation flow; rows appended to Google Sheets
- **LIFF Wi-Fi credential app** — customer asks the bot for Wi-Fi access; backend issues a timed credential (username / password / speed & uptime profile) that the customer retrieves inside a LIFF page
- **Hotspot admin API** — register LINE OAs, branches, Wi-Fi profiles; validate sales users; usage & login logs
- **Feedback rating** — post-visit rating storage (GLPI ticket id based)

## 🏗️ Architecture

```
 LINE users / LINE OA webhooks
        │
        ▼
┌───────────────────────────┐      ┌──────────────────────────┐
│  line-loyalty-backend      │      │  hotspot-backend          │
│  (NestJS, webhook router)  │      │  (NestJS, REST + LIFF)    │
│  • per-brand handlers      │◄────►│  • Wi-Fi profile engine   │
│  • conversations/sessions  │ HTTP │  • credential issuance    │
│  • rich menu / postback    │      │  • admin/branch entities  │
└──────────┬────────────────┘      └──────────┬───────────────┘
           │                                  │
           ├── PostgreSQL 15 (shared DB)      │
           │     wifihotspot_*, aurora_sale, glpi_rating_url
           │
           ├── Airtable (per-brand record storage)
           ├── Google Sheets API (test-drive booking rows)
           └── LIFF web app (views/liff.ejs, served by loyalty backend)
```

| Piece | Tech |
|---|---|
| Services | NestJS (TypeScript, Express), class-validator, Swagger |
| Messaging | LINE Messaging API (`@line/bot-sdk`) — webhooks, reply messages, flex messages, rich menus, postbacks |
| LIFF | LINE Frontend Framework mini-app (`views/liff.ejs`) |
| Data | PostgreSQL 15 via TypeORM (shared schema in `Database/DatabaseLineOA.sql`), docker-compose |
| External | Airtable API, Google Sheets API (`googleapis`) |
| Ops | Docker, `.env.example`-driven config per brand channel |

## 📁 Repository layout

```
├── docker-compose.yml            # postgres + both backends
├── Database/
│   ├── DatabaseLineOA.sql        # full schema (data rows stripped for the demo)
│   └── Dockerfile                # auto-init image
├── line-loyalty-backend/         # brand webhook backend (6 brand modules)
│   ├── config/                   # per-brand LINE channel config (env-driven)
│   ├── src/
│   │   ├── <brand>/              # brand controller/service/handlers ×6
│   │   ├── GoogleSheet/          # test-drive booking sync (service account)
│   │   ├── data/                 # fictional demo centers/branches/models
│   │   ├── liff/ + views/        # LIFF endpoint + web app
│   │   └── Utils/ Usersession/   # flex helpers, reply helpers, session store
│   └── public/assets/images/     # single neutral demo placeholder
└── hotspot-backend/              # Wi-Fi hotspot issuance & admin REST API
    └── src/hotspot/ + src/entities/
```

## 🚀 Running it locally

**Zero-setup demo mode (no database server, recommended for showing the project):**

```bash
cd hotspot-backend
cp .env.example .env        # optional; demo mode only needs DB_MODE
DB_MODE=demo npm run start:dev     # Windows PowerShell: $env:DB_MODE="demo"; npm run start:dev
# open http://localhost:3001/api  (Swagger UI)
```

In demo mode the app boots with an **in-memory SQLite database**, auto-creates the
schema and seeds fictional rows — the real TypeORM queries run, just with no Postgres
server and a clean reset on every restart.

Try these from Swagger (`POST /hotspot/...`):

```jsonc
// check-admin -> { "isAdmin": true }
{ "user": { "userId": "Udemoadmin1", "destination": "Udemolineoa1" } }

// Request-wifi -> issues the next free credential (counter advances each call)
{ "user": { "userId": "Udemocustomer1", "destination": "Udemolineoa1",
            "branchId": "B1", "username": "demo-customer" },
  "content": { "formattedDate": "09/05/2026 11:00" } }

// Admin/getLogs  { "user": { "userId":"Udemoadmin1", "destination":"Udemolineoa1", "branchId":"all" },
//                  "content": { "request": "usageLog" } }
// Admin/resetWifi (same shape, "request": "resetWifi") resets usage counters.
```

Full stack with PostgreSQL (original configuration):

```bash
# 1. env files (never commit real values)
cd line-loyalty-backend && cp .env.example .env   # fill per-brand LINE channel credentials
cd ../hotspot-backend && cp .env.example .env     # DB connection values

# 2. database + services
docker compose up --build          # postgres + line-loyalty-backend + hotspot-backend
# (or run each backend directly: npm ci && npm run start:dev)

# 3. LINE webhook
#    point each brand channel's webhook at https://<your-tunnel>/webhook (see per-backend README)
```

### Hosting the hotspot demo on Render (free tier)

- New Web Service from the GitHub repo; **Root Directory: `hotspot-backend`**
- Build command: `npm run build` · Start command: `npm run start:prod`
- Environment: `DB_MODE=demo` (no paid Postgres add-on needed — data is in-memory)
- The app reads `process.env.PORT`, which Render injects automatically
- Free instances sleep after ~15 min idle; the first request after sleep is slow (~30-50s cold start)

- **Google Sheets sync is optional**: set `GOOGLE_SHEETS_KEY_FILE` to a service-account key path, otherwise the feature logs a warning and stays disabled.
- Media assets were removed for privacy — the LIFF/UI references a neutral placeholder SVG. Add your own demo images under `public/assets/images/` to restore visuals.

## 🧠 Design notes / things I'd do differently

- Brand duplication (6 near-identical handler trees) begs for a **plugin/strategy registry keyed by brand** — a clean refactor target.
- Secrets discipline: everything already reads `process.env` via central `config/` — keep it that way; never commit `.env` or service-account JSON.
- Hotspot admin + loyalty bot share one Postgres but run as two deployments; a shared schema package would remove drift.

## ✍️ My role

<!-- TODO: fill in — e.g. what you built, owned, or contributed:
  - designed the per-brand webhook router / hotspot credential flow
  - implemented ..., integrated ..., deployed ...
-->
