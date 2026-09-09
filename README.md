# ⚡ Hassan Platform — Professional Personal Brand & Business Platform (V1)

[![GitHub Repo](https://img.shields.io/badge/GitHub-hassan--platform-00e5ff?logo=github)](https://github.com/Shifrozy/hassan-platform)
[![Version](https://img.shields.io/badge/version-1.0.0-00e676.svg)](https://github.com/Shifrozy/hassan-platform)
[![License](https://img.shields.io/badge/license-Proprietary-7952ff.svg)](LICENSE)

A high-performance, institutional-grade personal brand and digital software business website representing **M. Hassan** — specialist in **MetaTrader 4/5 Expert Advisors (EAs)**, **Python algorithmic trading bots**, **Interactive Brokers (IBKR) automation**, and low-latency quantitative execution software.

Built with a modern, responsive design system and **decoupled data architecture** to facilitate seamless scaling into customer dashboards, Stripe payments, and automated MQL5 license verification APIs.

---

## 🌟 Key Features (Version 1)

* **Quantitative Fintech Aesthetic:** Obsidian dark theme (`#070b14`), electric cyan (`#00e5ff`) and profit emerald (`#00e676`) indicators, glassmorphism cards, glowing borders, and clean typography (*Plus Jakarta Sans* & *JetBrains Mono*).
* **Decoupled Data Layer:** No hard-coded text or URLs! All services, products, portfolio case studies, reviews, and branding are managed in [`assets/js/config.js`](assets/js/config.js) and [`assets/js/data/`](assets/js/data/).
* **Full 7-Page Architecture:**
  1. [`index.html`](index.html) — High-converting landing page with live terminal simulation, stats, tech matrix, and FAQ.
  2. [`about.html`](about.html) — Biography, quantitative development pillars, tech matrix, and competitive advantages.
  3. [`services.html`](services.html) — 8 specialized development services and a 4-step delivery workflow.
  4. [`products.html`](products.html) — Digital trading software catalog with platform filters and product drawers.
  5. [`portfolio.html`](portfolio.html) — Real-world case studies with audited metrics (Profit Factor, Drawdown, Latency).
  6. [`reviews.html`](reviews.html) — Verified client reviews, star rating distributions, and submission modal.
  7. [`contact.html`](contact.html) — Inquiry form with project selectors, budget ranges, and honeypot spam protection.
* **Interactive Strategy ROI Simulator:** Interactive risk/reward and expectancy calculator allowing prospective clients to test mathematical compounding in real-time.
* **Interactive Product & Case Study Drawers:** Modular modal controllers ready to connect directly to Stripe Checkout and REST APIs in Phase 2+.
* **Production SEO & Accessibility:** Schema.org JSON-LD structured data, XML Sitemap (`sitemap.xml`), `robots.txt`, and OpenGraph tags.
* **Deployment Ready:** Step-by-step documentation for Hostinger, custom `.com` domains, free SSL, and Git CI/CD.

---

## 📁 Directory Structure

```text
d:\Projects\Hassan Products\
├── index.html                     # Home page & quantitative landing page
├── about.html                     # About Me & technical pillars
├── services.html                  # Services catalog & 4-step workflow
├── products.html                  # Products & EAs showcase
├── portfolio.html                 # Portfolio & institutional case studies
├── reviews.html                   # Verified client reviews & ratings
├── contact.html                   # Project inquiry form & direct channels
├── sitemap.xml                    # SEO Sitemap
├── robots.txt                     # SEO Crawl Directives
│
├── assets/
│   ├── css/
│   │   ├── variables.css          # Design tokens & color variables
│   │   ├── base.css               # Reset, typography, utility classes
│   │   ├── components.css         # Navbar, buttons, cards, modals, toast, footer
│   │   ├── pages.css              # Page layouts, hero terminal, ROI calculator
│   │   └── responsive.css         # Mobile & tablet breakpoints
│   │
│   ├── js/
│   │   ├── config.js              # Centralized site branding & contact info
│   │   ├── main.js                # Core controller: navigation, theme, drawer
│   │   ├── data/
│   │   │   ├── services.js        # Structured services data
│   │   │   ├── products.js        # Structured products data
│   │   │   ├── portfolio.js       # Structured portfolio data
│   │   │   ├── reviews.js         # Structured client reviews data
│   │   │   └── faq.js             # Structured FAQ data
│   │   └── components/
│   │       ├── product-modal.js   # Product modal & checkout drawer
│   │       ├── portfolio-filter.js# Dynamic tag/category filtering
│   │       ├── contact-form.js    # Client validation & honeypot anti-spam
│   │       └── roi-calculator.js  # Interactive strategy ROI simulator
│   │
│   └── images/
│       ├── brand/                 # Modern SVG logo, favicon, avatar
│       ├── products/              # High-tech SVG graphics for EAs & bots
│       └── portfolio/             # Case study equity curves & architecture diagrams
│
├── docs/
│   ├── HOSTINGER_DEPLOYMENT_GUIDE.md # Hostinger & custom .com domain setup
│   ├── ARCHITECTURE_AND_SCALING.md  # Multi-phase blueprint (Phases 2-7)
│   └── GITHUB_SETUP.md              # Git workflow instructions
│
├── .gitignore                     # Git ignore rules
└── README.md                      # Project documentation
```

---

## 🚀 Local Development

Because Phase 1 uses clean, modern Vanilla Web standards, no complex build steps or node package installations are required!

### Method 1: Using Python's Built-in Server (Recommended)
Open a terminal in the project directory and run:
```bash
python -m http.server 3000
```
Then open your browser at **[http://localhost:3000](http://localhost:3000)**.

### Method 2: VS Code / IDE Live Server
Right-click on `index.html` and select **"Open with Live Server"**.

---

## ⚙️ Customization & Branding

To update your contact email, Telegram handle, social links, or bio:
1. Open [`assets/js/config.js`](assets/js/config.js).
2. Modify the `SITE_CONFIG` values.
3. All pages and components automatically update across the entire website!

To add or edit products, services, or case studies:
* Edit [`assets/js/data/products.js`](assets/js/data/products.js)
* Edit [`assets/js/data/services.js`](assets/js/data/services.js)
* Edit [`assets/js/data/portfolio.js`](assets/js/data/portfolio.js)
* Edit [`assets/js/data/reviews.js`](assets/js/data/reviews.js)

---

## 🌐 Deploying to Hostinger & Custom Domain

Refer to the complete step-by-step guide in [`docs/HOSTINGER_DEPLOYMENT_GUIDE.md`](docs/HOSTINGER_DEPLOYMENT_GUIDE.md) to:
1. Upload your files via Hostinger File Manager or Git Auto-Deploy.
2. Point your custom `.com` domain.
3. Activate free SSL (HTTPS).
4. Create your business email (`contact@yourdomain.com`).

---

## 🔮 Future Scalability (Phases 2 – 7)

For the technical roadmap covering Admin Dashboards, User Accounts, Stripe Payments, and Automated MQL5 License Verification APIs, see [`docs/ARCHITECTURE_AND_SCALING.md`](docs/ARCHITECTURE_AND_SCALING.md).
