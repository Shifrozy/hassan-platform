const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const env = require('../config/env');

const initialProducts = [
  {
    id: "apex-trend-scalper-pro",
    name: "Apex Trend Scalper Pro",
    version: "v3.4.2",
    tagline: "Institutional Order-Flow Trend Scalping EA for MT5 & MT4",
    platform: "MT5 / MT4",
    platform_badge: "badge-mt5",
    category: "Expert Advisor",
    price: 349,
    price_formatted: "$349",
    billing_type: "One-Time License",
    rating: 4.9,
    reviews_count: 38,
    image: "assets/images/products/apex-scalper.svg",
    badge: "Flagship EA",
    short_desc: "High-frequency precision trend follower utilizing dynamic volatility channels and tick-volume order imbalances for Gold (XAUUSD), US30, and FX pairs.",
    features: [
      "Built-in News Filter (ForexFactory integration)",
      "Dynamic Multi-Tier Trailing Stop & Partial Close",
      "Spread and Slippage Protection Engine",
      "Prop-Firm Ready (Daily Equity Drawdown Protector)",
      "Supports Cent, Standard, ECN & Raw Accounts",
      "Lifetime Updates & Preset Configurations Included"
    ],
    supported_pairs: ["XAUUSD", "US30", "NAS100", "EURUSD", "GBPUSD"],
    min_deposit: "$500 (Standard) / $50 (Cent)",
    recommended_timeframe: "M5 / M15",
    changelog: [
      "v3.4.2: Enhanced spread filter during high volatility CPI/NFP releases",
      "v3.4.0: Added proprietary Equity Guard auto-close feature for FTMO & FundedNext accounts",
      "v3.2.0: Optimized MQL5 execution speed by 35%"
    ],
    display_order: 1
  },
  {
    id: "titan-quantum-grid",
    name: "Titan Quantum Grid & Hedging Suite",
    version: "v2.8.0",
    tagline: "Statistical Mean-Reversion Grid with Dynamic Multi-Tier Hedging",
    platform: "MetaTrader 5",
    platform_badge: "badge-mt5",
    category: "Expert Advisor",
    price: 299,
    price_formatted: "$299",
    billing_type: "One-Time License",
    rating: 4.8,
    reviews_count: 29,
    image: "assets/images/products/titan-grid.svg",
    badge: "Consistent Yield",
    short_desc: "Smart mathematical grid algorithm that avoids toxic martingale compounding. Features dynamic ATR grid spacing and automated hedge locks during strong macro trends.",
    features: [
      "Non-linear ATR-based adaptive grid spacing",
      "Macro Trend Directional Lock (No fighting major trends)",
      "Automated Emergency Basket Hedge Protection",
      "Multi-currency correlation hedge analyzer",
      "Complete Visual On-Chart Control Panel & Statistics"
    ],
    supported_pairs: ["AUDCAD", "NZDCAD", "EURGBP", "GBPCAD"],
    min_deposit: "$1,000",
    recommended_timeframe: "H1",
    changelog: [
      "v2.8.0: Integrated correlation matrix to prevent simultaneous basket drawdowns",
      "v2.5.0: Added custom visual dashboard on MT5 chart canvas"
    ],
    display_order: 2
  },
  {
    id: "ibkr-arbitrage-copier",
    name: "IBKR Multi-Account Copier & Arbitrage Engine",
    version: "v4.1.0",
    tagline: "Sub-Millisecond Trade Replication & Latency Arbitrage Engine",
    platform: "Python / IBKR",
    platform_badge: "badge-ibkr",
    category: "Python Software",
    price: 499,
    price_formatted: "$499",
    billing_type: "One-Time License",
    rating: 5.0,
    reviews_count: 17,
    image: "assets/images/products/ibkr-copier.svg",
    badge: "Institutional Tool",
    short_desc: "High-speed standalone Python application connecting to multiple Interactive Brokers TWS/Gateway sessions to replicate trades with custom risk multipliers.",
    features: [
      "Direct Socket API connection (< 5ms replication)",
      "Supports Equities, Options, Futures, and Forex",
      "Multi-Account Master/Slave with proportional balance scaling",
      "Built-in Desktop GUI (PyQt6) & Headless Server Mode",
      "Encrypted Telegram Trade Broadcasts & Error Logging"
    ],
    supported_pairs: ["Stocks", "Options", "Futures (ES/NQ)", "Forex"],
    min_deposit: "$5,000",
    recommended_timeframe: "All Timeframes",
    changelog: [
      "v4.1.0: Support for complex multi-leg options spreads replication",
      "v4.0.0: Redesigned dark-mode monitoring dashboard with real-time PnL"
    ],
    display_order: 3
  },
  {
    id: "institutional-risk-guard",
    name: "Institutional Drawdown & Risk Guard",
    version: "v2.1.5",
    tagline: "Hard Equity Lock & Prop-Firm Rule Enforcement Utility",
    platform: "MT5 / MT4 / Python",
    platform_badge: "badge-success",
    category: "Risk Management",
    price: 149,
    price_formatted: "$149",
    billing_type: "One-Time License",
    rating: 4.9,
    reviews_count: 45,
    image: "assets/images/products/risk-guard.svg",
    badge: "Essential Security",
    short_desc: "Prevents account blowout by enforcing strict daily loss limits, maximum overall drawdown, trailing drawdowns, and blocking trading during emotional revenge episodes.",
    features: [
      "Daily Maximum Loss Equity Hard Lock",
      "Automated close of all open trades on breach",
      "Disable auto-trading & sound alarm on threshold reach",
      "Compatible with FTMO, The Funded Trader, MFF, FundedNext rules",
      "Password lock prevents trader from overriding limits mid-session"
    ],
    supported_pairs: ["All Instruments & Asset Classes"],
    min_deposit: "$100",
    recommended_timeframe: "Universal",
    changelog: [
      "v2.1.5: Added support for floating profit trailing drawdown calculation",
      "v2.0.0: Multi-terminal server synchronization via local IPC"
    ],
    display_order: 4
  },
  {
    id: "prop-challenge-pass-ea",
    name: "Prop-Firm Challenge Pass Guard EA",
    version: "v1.9.0",
    tagline: "Conservative Target Progression Algorithm for Evaluation Accounts",
    platform: "MetaTrader 5",
    platform_badge: "badge-mt5",
    category: "Expert Advisor",
    price: 399,
    price_formatted: "$399",
    billing_type: "One-Time License",
    rating: 4.8,
    reviews_count: 22,
    image: "assets/images/products/prop-guard.svg",
    badge: "Evaluation Special",
    short_desc: "Designed specifically for Phase 1 & Phase 2 prop firm evaluations with micro-lot risk sizing, zero overnight holding risk, and fixed 1:2.5 risk-to-reward mechanics.",
    features: [
      "Strict 0.5% max risk per trade calculation",
      "Automatic Friday market close to prevent weekend gap risk",
      "Zero Martingale, Zero Grid, Zero Averaging Down",
      "High probability London & New York session breakout setups",
      "Auto-stops execution once target profit % is reached"
    ],
    supported_pairs: ["US30", "NAS100", "EURUSD", "GBPUSD"],
    min_deposit: "$10,000 (Challenge Size)",
    recommended_timeframe: "M15",
    changelog: [
      "v1.9.0: Added New York session volatility filter",
      "v1.8.2: Enhanced dynamic spread guard"
    ],
    display_order: 5
  }
];

const initialServices = [
  {
    id: "mt5-ea-development",
    title: "MT4 / MT5 Expert Advisor (EA) Development",
    category: "MetaTrader",
    icon: "terminal",
    short_desc: "Full-cycle MQL4/MQL5 algorithmic bot programming with advanced order management, dynamic trailing stops, and multi-currency support.",
    detailed_desc: "Transform your trading strategies into lightning-fast, high-precision automated Expert Advisors. Every EA is built with defensive error handling, slippage filters, spread monitors, news-event filters, and seamless compatibility with prop-firms and retail brokers.",
    technologies: ["MQL5", "MQL4", "MetaEditor", "WinAPI", "MetaTrader Strategy Tester"],
    benefits: [
      "Zero execution delay & millisecond precision",
      "Prop-firm compliance (Drawdown guard, equity lock)",
      "Multi-timeframe and multi-currency analysis",
      "Clean source code with detailed documentation"
    ],
    badge: "Most Popular",
    cta_text: "Request EA Quote",
    display_order: 1
  },
  {
    id: "python-trading-bots",
    title: "Python Algorithmic Trading Bots",
    category: "Python & Crypto",
    icon: "cpu",
    short_desc: "Asynchronous Python bots connecting to crypto exchanges and forex brokers via REST and WebSocket APIs.",
    detailed_desc: "High-throughput quantitative trading engines engineered with Python, Asyncio, Pandas, and ccxt. Supporting order book imbalance detection, statistical arbitrage, market-making models, and automated portfolio rebalancing.",
    technologies: ["Python 3", "Asyncio", "ccxt", "WebSockets", "Pandas", "NumPy"],
    benefits: [
      "Sub-millisecond WebSocket market streaming",
      "Multi-exchange execution (Binance, Bybit, OKX, Kraken)",
      "Telegram & Discord live trade alert integrations",
      "Database trade logging (PostgreSQL/SQLite)"
    ],
    badge: "High-Frequency",
    cta_text: "Build Python Bot",
    display_order: 2
  },
  {
    id: "ibkr-automation",
    title: "Interactive Brokers (IBKR) Automation",
    category: "Broker APIs",
    icon: "trending-up",
    short_desc: "Automated options, equities, futures, and FX trading utilizing IBKR TWS API, IB Gateway, and ib_insync.",
    detailed_desc: "Institutional-grade connectivity to Interactive Brokers. Build complex delta-neutral options strategies, automated order routing, multi-account trade copiers, and custom desktop dashboards for professional fund managers.",
    technologies: ["IBKR TWS API", "IB Gateway", "ib_insync", "Python", "C#"],
    benefits: [
      "Direct market access across global stock & options exchanges",
      "Multi-account master/slave allocation",
      "Advanced multi-leg options combinations",
      "Fail-safe auto-reconnection mechanics"
    ],
    badge: "Institutional",
    cta_text: "Automate IBKR",
    display_order: 3
  },
  {
    id: "strategy-automation",
    title: "Custom Trading Strategy Automation",
    category: "Strategy Design",
    icon: "activity",
    short_desc: "Converting manual discretionary rules, Pine Script indicators, and TradingView alerts into automated bots.",
    detailed_desc: "Have a profitable manual setup or TradingView script? We convert your entry/exit logic, multi-indicator confluence, and chart pattern rules into fully automated execution software with webhook bridges.",
    technologies: ["Pine Script v5", "TradingView Webhooks", "Python", "MQL5"],
    benefits: [
      "Eliminate emotional trading mistakes",
      "Instant execution upon TradingView webhook trigger",
      "Strict lot size calculation according to account balance",
      "Comprehensive rule validation before live launch"
    ],
    badge: "Discretionary to Algo",
    cta_text: "Automate My Strategy",
    display_order: 4
  },
  {
    id: "backtesting-optimization",
    title: "Backtesting & Quantitative Optimization",
    category: "Quantitative",
    icon: "bar-chart-2",
    short_desc: "99.9% tick-quality historical testing, Monte Carlo simulations, and Walk-Forward parameter optimization.",
    detailed_desc: "Determine the true mathematical viability of your trading edge before risking real capital. We run rigorous backtests using real tick data, variable spreads, commission modeling, and stress-test under extreme market flash-crashes.",
    technologies: ["Tick Data Suite", "Monte Carlo Analysis", "Walk-Forward Matrix", "Python Backtesting.py"],
    benefits: [
      "Accurate modeling with slippage and commission",
      "Identification of curve-fitting traps",
      "Detailed equity curve, Sharpe Ratio, and Drawdown reports",
      "Optimal parameter clusters for stable forward performance"
    ],
    badge: "Risk Mitigation",
    cta_text: "Test My Strategy",
    display_order: 5
  },
  {
    id: "vps-latency-tuning",
    title: "VPS & 24/7 Trading Infrastructure Setup",
    category: "Infrastructure",
    icon: "server",
    short_desc: "Turnkey deployment of MetaTrader instances and Python bots on ultra-low latency Windows/Linux VPS servers.",
    detailed_desc: "Never miss a trade due to power outages or home internet failure. We configure hardened VPS environments, auto-start watchdogs, memory monitoring, and automated daily backup routines.",
    technologies: ["Windows Server", "Ubuntu Linux", "Docker", "Systemd Watchdogs", "RDP"],
    benefits: [
      "Co-located sub-5ms broker cross-connect latency",
      "Automated system recovery after unexpected server reboot",
      "Encrypted remote access management",
      "Resource optimization for smooth multi-terminal execution"
    ],
    badge: "Infrastructure",
    cta_text: "Deploy VPS Setup",
    display_order: 6
  }
];

const initialPortfolio = [
  {
    id: "gold-institutional-scalper",
    title: "Institutional Gold (XAUUSD) High-Frequency EA",
    category: "MetaTrader",
    category_label: "MT5 Expert Advisor",
    client_type: "Private Prop Trader (Switzerland)",
    image: "assets/images/portfolio/project-mt5-ea.svg",
    description: "Engineered an ultra-low latency MQL5 Expert Advisor utilizing Level 2 Order Book imbalance and ATR dynamic channels on 1-minute Gold charts.",
    metrics: [
      { label: "Profit Factor", value: "2.34" },
      { label: "Max Drawdown", value: "4.8%" },
      { label: "Win Rate", value: "68.2%" },
      { label: "Execution Latency", value: "< 12ms" }
    ],
    technologies: ["MQL5", "MetaTrader 5", "Tick Data Suite", "FastAPI"],
    features: [
      "Dynamic slippage filter preventing trades during high-impact news",
      "Asynchronous order execution minimizing requotes",
      "Passed $200,000 FTMO Challenge in 14 trading days"
    ],
    status: "Active on Live Account",
    display_order: 1
  },
  {
    id: "crypto-cross-exchange-arbitrage",
    title: "Cross-Exchange Crypto Statistical Arbitrage Bot",
    category: "Python",
    category_label: "Python Trading Bot",
    client_type: "Family Office (Singapore)",
    image: "assets/images/portfolio/project-crypto-bot.svg",
    description: "Developed an asynchronous multi-threaded Python engine capturing basis spread differentials between Binance Futures and Bybit Perpetual contracts.",
    metrics: [
      { label: "Monthly Yield", value: "4.6% Avg" },
      { label: "Sharpe Ratio", value: "3.82" },
      { label: "Avg Spread Captured", value: "8.4 bps" },
      { label: "Uptime", value: "99.98%" }
    ],
    technologies: ["Python 3", "Asyncio", "ccxt", "WebSockets", "Docker", "PostgreSQL"],
    features: [
      "Sub-millisecond WebSocket market data feed handlers",
      "Automated delta-neutral funding rate harvesting",
      "Redis caching layer for zero-latency order book snapshots"
    ],
    status: "Production Cloud Cluster",
    display_order: 2
  },
  {
    id: "ibkr-options-volatility-harvester",
    title: "IBKR Automated Delta-Neutral Options Engine",
    category: "Interactive Brokers",
    category_label: "IBKR Automation",
    client_type: "Registered Investment Advisor (USA)",
    image: "assets/images/portfolio/project-ibkr-system.svg",
    description: "Built an institutional options execution system connecting to Interactive Brokers TWS API to trade 0DTE SPX Iron Condors with dynamic delta rebalancing.",
    metrics: [
      { label: "Annualized Alpha", value: "+28.4%" },
      { label: "Beta to S&P 500", value: "0.12" },
      { label: "Max Consecutive Wins", value: "24 Trades" },
      { label: "Accounts Managed", value: "18 Accounts" }
    ],
    technologies: ["IBKR TWS API", "ib_insync", "Python", "NumPy", "PyQt6"],
    features: [
      "Automated implied volatility rank (IV Rank) scanner",
      "Multi-account fractional risk allocator",
      "Real-time gamma and delta risk curve dashboard"
    ],
    status: "Live Institutional Deployment",
    display_order: 3
  },
  {
    id: "tradingview-metaapi-copier",
    title: "TradingView Webhook to Multi-Broker Execution Cloud",
    category: "API Integration",
    category_label: "Cloud API Bridge",
    client_type: "Signal Provider Community (UK)",
    image: "assets/images/portfolio/project-arbitrage.svg",
    description: "Engineered a high-availability cloud middleware translating TradingView PineScript alerts into MT4, MT5, and cTrader orders across 500+ client terminals simultaneously.",
    metrics: [
      { label: "Replication Speed", value: "140ms" },
      { label: "Client Accounts", value: "540+ Terminals" },
      { label: "Daily Executions", value: "3,200+" },
      { label: "Execution Success", value: "99.94%" }
    ],
    technologies: ["Node.js", "Express", "MetaAPI", "Redis", "AWS Lambda", "MongoDB"],
    features: [
      "Cryptographic HMAC signature validation on all incoming webhooks",
      "Automated lot sizing calculation based on each client's account equity",
      "Interactive Telegram bot for clients to pause/resume signal copying"
    ],
    status: "Enterprise SaaS Architecture",
    display_order: 4
  }
];

const initialReviews = [
  {
    id: "rev-1",
    client_name: "David K.",
    country: "United States",
    country_code: "US",
    role: "Prop Firm Trader & Fund Manager",
    service_used: "MT5 Expert Advisor Development",
    rating: 5,
    date: "August 2024",
    avatar: "DK",
    comment: "Hassan is by far the most competent MQL5 developer I have worked with in 8 years of algorithmic trading. He took my complex discretionary strategy, identified edge cases I hadn't even considered, and delivered a flawless EA that passed my $200k prop challenge with zero bugs.",
    verified: true,
    display_order: 1
  },
  {
    id: "rev-2",
    client_name: "Marcus Vance",
    country: "United Kingdom",
    country_code: "GB",
    role: "Quantitative Analyst",
    service_used: "Python & IBKR Automation",
    rating: 5,
    date: "July 2024",
    avatar: "MV",
    comment: "Exceptional Python coding skills. He built an automated options execution system connected to Interactive Brokers that handles high volatility effortlessly. Clean code, comprehensive documentation, and prompt communication. Highly recommended.",
    verified: true,
    display_order: 2
  },
  {
    id: "rev-3",
    client_name: "Siddharth Mehta",
    country: "United Arab Emirates",
    country_code: "AE",
    role: "Asset Management Director",
    service_used: "TradingView Webhook & MetaAPI Bridge",
    rating: 5,
    date: "June 2024",
    avatar: "SM",
    comment: "We needed a sub-second webhook execution engine to broadcast TradingView signals to 100+ MT5 client accounts. Hassan delivered ahead of schedule and the system has been running with 99.99% uptime for months. A true technical partner.",
    verified: true,
    display_order: 3
  },
  {
    id: "rev-4",
    client_name: "Johannes Weber",
    country: "Germany",
    country_code: "DE",
    role: "Forex Scalper",
    service_used: "Apex Trend Scalper Pro Product",
    rating: 5,
    date: "May 2024",
    avatar: "JW",
    comment: "The Apex Trend Scalper EA is phenomenal on Gold (XAUUSD). The news filter and dynamic trailing stop protected my account during the CPI volatility while still locking in solid gains. Top tier software quality.",
    verified: true,
    display_order: 4
  },
  {
    id: "rev-5",
    client_name: "Liam O'Connor",
    country: "Australia",
    country_code: "AU",
    role: "Crypto Systems Trader",
    service_used: "Crypto Arbitrage Bot Development",
    rating: 5,
    date: "April 2024",
    avatar: "LO",
    comment: "Hassan built an asynchronous Python bot for Bybit and Binance with ccxt. His deep understanding of order books, latency mitigation, and WebSocket handlers set him apart from regular developers. Will definitely hire again.",
    verified: true,
    display_order: 5
  },
  {
    id: "rev-6",
    client_name: "Alexandre Dubois",
    country: "France",
    country_code: "FR",
    role: "Discretionary & Algo Trader",
    service_used: "EA Optimization & Bug Fixing",
    rating: 5,
    date: "March 2024",
    avatar: "AD",
    comment: "My existing MT4 EA had severe memory leaks and was freezing during backtests. Hassan completely refactored it into clean MQL5, reduced execution times by 40%, and added an intuitive on-chart dashboard. Superb work!",
    verified: true,
    display_order: 6
  }
];

const initialSiteConfig = {
  brand: {
    name: "ALGENZA",
    suffix: "",
    tag: "PRO",
    tagline: "Quantitative Trading & Automation Specialist",
    shortBio: "Developing institutional-grade MetaTrader 4/5 EAs, Python algorithmic trading bots, and Interactive Brokers API automations for global traders & funds.",
    logoText: "ALGENZA",
    logoHighlight: "",
    statusText: "AVAILABLE FOR PROJECTS",
    foundedYear: 2020
  },
  author: {
    name: "M. Hassan",
    title: "CEO & Co-Founder of Algenza",
    location: "Global / Remote Solutions",
    experienceYears: "6+",
    completedProjects: "140+",
    satisfiedClients: "95+",
    totalAutomatedVolume: "$45M+"
  },
  hero: {
    badge: "CEO & Co-Founder of Algenza",
    status: "AVAILABLE FOR PROJECTS",
    line1: "I Build",
    highlight: "Trading Algorithms",
    line2: "That Actually Work",
    description: "Professional developer specializing in MetaTrader 4/5 Expert Advisors, Python trading bots, and Interactive Brokers automation. Trusted by prop traders, fund managers, and quantitative investors globally.",
    profileImage: "assets/images/brand/hassan-profile.jpg",
    stat1Val: "140+",
    stat1Label: "EAs & Bots Deployed",
    stat2Val: "6+",
    stat2Label: "Years Experience",
    stat3Val: "5.0",
    stat3Label: "Client Rating"
  },
  contact: {
    email: "contact@algenza.com",
    telegram: "@HassanAlgo",
    telegramUrl: "https://t.me/HassanAlgo",
    whatsapp: "+92 300 0000000",
    githubUrl: "https://github.com/Shifrozy/hassan-platform",
    linkedinUrl: "#",
    discordUrl: "#",
    responseTime: "< 4 Hours"
  },
  meta: {
    siteUrl: "https://algenza.com",
    ogImage: "assets/images/brand/hassan-profile.jpg",
    twitterHandle: "@your_handle"
  }
};

async function seedDatabase() {
  console.log('🌱 Starting database seed...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Seed Admin User
    const adminEmail = env.adminEmail.toLowerCase().trim();
    const adminPassword = env.adminInitialPassword;
    const adminName = env.adminName;

    const existingAdmin = await client.query('SELECT id FROM admins WHERE email = $1', [adminEmail]);
    if (existingAdmin.rows.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await client.query(
        'INSERT INTO admins (email, password_hash, full_name) VALUES ($1, $2, $3)',
        [adminEmail, passwordHash, adminName]
      );
      console.log(`✅ Admin user seeded (${adminEmail})`);
    } else {
      console.log(`ℹ️ Admin user already exists (${adminEmail})`);
    }

    // 2. Seed Products
    for (const prod of initialProducts) {
      await client.query(
        `INSERT INTO products (
          id, name, version, tagline, platform, platform_badge, category, price,
          price_formatted, billing_type, rating, reviews_count, image, badge,
          short_desc, features, supported_pairs, min_deposit, recommended_timeframe,
          changelog, display_order, is_active
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19, $20, $21, true
        ) ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          version = EXCLUDED.version,
          tagline = EXCLUDED.tagline,
          price = EXCLUDED.price,
          updated_at = NOW()`,
        [
          prod.id, prod.name, prod.version, prod.tagline, prod.platform, prod.platform_badge,
          prod.category, prod.price, prod.price_formatted, prod.billing_type, prod.rating,
          prod.reviews_count, prod.image, prod.badge, prod.short_desc, JSON.stringify(prod.features),
          JSON.stringify(prod.supported_pairs), prod.min_deposit, prod.recommended_timeframe,
          JSON.stringify(prod.changelog), prod.display_order
        ]
      );
    }
    console.log(`✅ ${initialProducts.length} products seeded.`);

    // 3. Seed Services
    for (const srv of initialServices) {
      await client.query(
        `INSERT INTO services (
          id, title, category, icon, short_desc, detailed_desc, technologies,
          benefits, badge, cta_text, display_order, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          short_desc = EXCLUDED.short_desc,
          updated_at = NOW()`,
        [
          srv.id, srv.title, srv.category, srv.icon, srv.short_desc, srv.detailed_desc,
          JSON.stringify(srv.technologies), JSON.stringify(srv.benefits), srv.badge,
          srv.cta_text, srv.display_order
        ]
      );
    }
    console.log(`✅ ${initialServices.length} services seeded.`);

    // 4. Seed Portfolio
    for (const port of initialPortfolio) {
      await client.query(
        `INSERT INTO portfolio (
          id, title, category, category_label, client_type, image, description,
          metrics, technologies, features, status, display_order, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          updated_at = NOW()`,
        [
          port.id, port.title, port.category, port.category_label, port.client_type,
          port.image, port.description, JSON.stringify(port.metrics), JSON.stringify(port.technologies),
          JSON.stringify(port.features), port.status, port.display_order
        ]
      );
    }
    console.log(`✅ ${initialPortfolio.length} portfolio items seeded.`);

    // 5. Seed Reviews
    for (const rev of initialReviews) {
      await client.query(
        `INSERT INTO reviews (
          id, client_name, country, country_code, role, service_used, rating,
          date, avatar, comment, verified, display_order, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
        ON CONFLICT (id) DO UPDATE SET
          client_name = EXCLUDED.client_name,
          comment = EXCLUDED.comment,
          updated_at = NOW()`,
        [
          rev.id, rev.client_name, rev.country, rev.country_code, rev.role,
          rev.service_used, rev.rating, rev.date, rev.avatar, rev.comment,
          rev.verified, rev.display_order
        ]
      );
    }
    console.log(`✅ ${initialReviews.length} reviews seeded.`);

    // 6. Seed Site Config
    await client.query(
      `INSERT INTO site_config (id, config_data)
       VALUES ('default', $1)
       ON CONFLICT (id) DO UPDATE SET
         config_data = EXCLUDED.config_data,
         updated_at = NOW()`,
      [JSON.stringify(initialSiteConfig)]
    );
    console.log('✅ Site configuration seeded.');

    await client.query('COMMIT');
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
