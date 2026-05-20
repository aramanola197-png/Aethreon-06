# AETHREON IQ

> **AETHREON Intelligence Layer** — a premium Web3 reputation intelligence platform powered by the [Zero Authority DAO](https://zeroauthoritydao.com/) API.

AETHREON IQ resolves any STX wallet into a **contributor dossier**: activity sources (bounties, gigs, quests, grants, events), governance participation (SIPs), credibility signals, and a derived 0–1000 reputation score across five axes. Results can be **saved persistently** and **exported as branded image cards**.

---

## ✦ Submission Checklist

| Item | Value |
|---|---|
| **Product name** | AETHREON IQ |
| **Live link** | _add after Render deploy_ |
| **GitHub repo** | _add after push_ |
| **X account** | _add after creation_ |
| **Stack** | Node.js · Express.js · EJS · Vanilla CSS · Vanilla JS · MongoDB |
| **Deployed on** | Render |

### Short explanation
AETHREON IQ is an intelligence operating system for the Zero Authority DAO ecosystem. It fuses contributor activity from across the platform — bounties, gigs, quests, grants, events and governance — into a single inspectable, comparable, exportable reputation signal. Built for grant councils, hiring DAOs, governance reviewers and contributors who want their own verifiable footprint.

### Features implemented
- **Wallet Intelligence** — resolve any STX address into a full contributor dossier.
- **Reputation Engine** — proprietary 0–1000 scoring across Contribution, Governance, Consistency, Credibility, Economic axes with tier ranking (Initiate → Obsidian).
- **Compare Wallets** — side-by-side dual-profile resolution.
- **Activity Feed** — live bounties / gigs / quests / grants / events with source filtering.
- **Analytics** — ecosystem-wide aggregate snapshot.
- **Discover** — surface and search active contributors.
- **Saved Searches** — persistent MongoDB-backed dossier vault.
- **Notifications** — in-platform notification system with categorized tags.
- **AI Terminal** — scoped assistant for in-platform navigation and utility guidance.
- **Unique branded export cards** per utility (PNG download).
- **Avatar picker**, **theme switcher** (light / dark / system), **background animation toggle**, **notification preference toggle** — all persisted to local storage.
- **Fully responsive** — desktop, tablet, mobile.

### Zero Authority DAO API endpoints used
- `GET /users` — contributor cohorts
- `GET /users/{stxAddress}` — wallet resolution (Wallet Intelligence, Reputation, Compare)
- `GET /users/search` — Discover queries
- `GET /users/stats` — Analytics
- `GET /bounties` — Activity feed
- `GET /gigs` + `GET /gigs/stats` — Activity feed + Analytics
- `GET /quests` + `GET /quest/stats` — Activity feed + Analytics
- `GET /grants` — Activity feed
- `GET /events` — Activity feed
- `GET /sips` + `GET /sips/stats` — Governance signal + Analytics
- `GET /stats` — Platform aggregate Analytics

API docs: <https://zeroauthoritydao.com/api-docs>

---

## ✦ Local development

```bash
git clone <your-repo-url>
cd aethreon-iq
cp .env.example .env       # then edit MONGODB_URI
npm install
npm run dev                # nodemon on http://localhost:3000
```

`.env`

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/aethreon_iq
ZAD_API_BASE=https://zeroauthoritydao.com/api
NODE_ENV=development
```

Without a MongoDB connection the app still runs; Saved Searches and Notifications return an offline message.

---

## ✦ Deploy to Render

1. **Push to GitHub**
   ```bash
   git init && git add . && git commit -m "AETHREON IQ initial"
   git branch -M main
   git remote add origin https://github.com/<you>/aethreon-iq.git
   git push -u origin main
   ```
2. **Create a free MongoDB Atlas cluster** → copy the connection string.
3. **Render → New → Web Service** → connect the GitHub repo.
4. Render auto-detects `render.yaml`. When prompted set:
   - `MONGODB_URI` = your Atlas connection string
5. Deploy. The service starts on the assigned public URL.

Alternatively, point Render manually:
- **Build command**: `npm install`
- **Start command**: `node server.js`
- **Environment vars**: `MONGODB_URI`, `ZAD_API_BASE=https://zeroauthoritydao.com/api`, `NODE_ENV=production`

---

## ✦ Brand identity

- **Logo** — `public/images/logo-brandname.jpg`
- **Colors**
  - Background `#192547`
  - Particle / animation `#7BBDE8`
  - Text `#FFEDBD`
  - Accent / dividers `#AD8411`
- **Fonts** — Geist (headings), Montserrat (body), Ubuntu / Ubuntu Mono (terminal & metrics)
- **Voice** — operational, premium, intelligence-system

---

## ✦ Project structure

```
.
├── server.js                       # Express + EJS bootstrap
├── render.yaml                     # Render IaC
├── routes/
│   ├── index.js                    # page routes
│   └── api.js                      # JSON API
├── services/
│   ├── zad.js                      # Zero Authority DAO HTTP client
│   ├── reputation.js               # scoring engine
│   └── ai.js                       # scoped assistant (rule-based)
├── models/
│   ├── SavedSearch.js              # MongoDB / Mongoose
│   └── Notification.js
├── views/
│   ├── layout.ejs                  # global shell
│   ├── partials/                   # sidebar, topbar, panels, terminal…
│   ├── icons/                      # inline SVG icons
│   └── pages/                      # home + 8 utility pages
└── public/
    ├── css/app.css                 # design system
    ├── js/app.js                   # vanilla JS client
    └── images/logo-brandname.jpg
```

---

## ✦ License

MIT — built for the **Zero Authority DAO BuildSprint Exam**.
