/**
 * ============================================================================
 * Services Data Module
 * ============================================================================
 */

var SERVICES_DATA = window.SERVICES_DATA = [
  {
    id: "mt5-ea-development",
    title: "MT4 / MT5 Expert Advisor (EA) Development",
    category: "MetaTrader",
    icon: "terminal",
    shortDesc: "Full-cycle MQL4/MQL5 algorithmic bot programming with advanced order management, dynamic trailing stops, and multi-currency support.",
    detailedDesc: "Transform your trading strategies into lightning-fast, high-precision automated Expert Advisors. Every EA is built with defensive error handling, slippage filters, spread monitors, news-event filters, and seamless compatibility with prop-firms and retail brokers.",
    technologies: ["MQL5", "MQL4", "MetaEditor", "WinAPI", "MetaTrader Strategy Tester"],
    benefits: [
      "Zero execution delay & millisecond precision",
      "Prop-firm compliance (Drawdown guard, equity lock)",
      "Multi-timeframe and multi-currency analysis",
      "Clean source code with detailed documentation"
    ],
    badge: "Most Popular",
    ctaText: "Request EA Quote"
  },
  {
    id: "python-trading-bots",
    title: "Python Algorithmic Trading Bots",
    category: "Python & Crypto",
    icon: "cpu",
    shortDesc: "Asynchronous Python bots connecting to crypto exchanges and forex brokers via REST and WebSocket APIs.",
    detailedDesc: "High-throughput quantitative trading engines engineered with Python, Asyncio, Pandas, and ccxt. Supporting order book imbalance detection, statistical arbitrage, market-making models, and automated portfolio rebalancing.",
    technologies: ["Python 3", "Asyncio", "ccxt", "WebSockets", "Pandas", "NumPy"],
    benefits: [
      "Sub-millisecond WebSocket market streaming",
      "Multi-exchange execution (Binance, Bybit, OKX, Kraken)",
      "Telegram & Discord live trade alert integrations",
      "Database trade logging (PostgreSQL/SQLite)"
    ],
    badge: "High-Frequency",
    ctaText: "Build Python Bot"
  },
  {
    id: "ibkr-automation",
    title: "Interactive Brokers (IBKR) Automation",
    category: "Broker APIs",
    icon: "trending-up",
    shortDesc: "Automated options, equities, futures, and FX trading utilizing IBKR TWS API, IB Gateway, and ib_insync.",
    detailedDesc: "Institutional-grade connectivity to Interactive Brokers. Build complex delta-neutral options strategies, automated order routing, multi-account trade copiers, and custom desktop dashboards for professional fund managers.",
    technologies: ["IBKR TWS API", "IB Gateway", "ib_insync", "Python", "C#"],
    benefits: [
      "Direct market access across global stock & options exchanges",
      "Multi-account master/slave allocation",
      "Advanced multi-leg options combinations",
      "Fail-safe auto-reconnection mechanics"
    ],
    badge: "Institutional",
    ctaText: "Automate IBKR"
  },
  {
    id: "strategy-automation",
    title: "Custom Trading Strategy Automation",
    category: "Strategy Design",
    icon: "activity",
    shortDesc: "Converting manual discretionary rules, Pine Script indicators, and TradingView alerts into automated bots.",
    detailedDesc: "Have a profitable manual setup or TradingView script? We convert your entry/exit logic, multi-indicator confluence, and chart pattern rules into fully automated execution software with webhook bridges.",
    technologies: ["Pine Script v5", "TradingView Webhooks", "Python", "MQL5"],
    benefits: [
      "Eliminate emotional trading mistakes",
      "Instant execution upon TradingView webhook trigger",
      "Strict lot size calculation according to account balance",
      "Comprehensive rule validation before live launch"
    ],
    badge: "Discretionary to Algo",
    ctaText: "Automate My Strategy"
  },
  {
    id: "backtesting-optimization",
    title: "Backtesting & Quantitative Optimization",
    category: "Quantitative",
    icon: "bar-chart-2",
    shortDesc: "99.9% tick-quality historical testing, Monte Carlo simulations, and Walk-Forward parameter optimization.",
    detailedDesc: "Determine the true mathematical viability of your trading edge before risking real capital. We run rigorous backtests using real tick data, variable spreads, commission modeling, and stress-test under extreme market flash-crashes.",
    technologies: ["Tick Data Suite", "Monte Carlo Analysis", "Walk-Forward Matrix", "Python Backtesting.py"],
    benefits: [
      "Accurate modeling with slippage and commission",
      "Identification of curve-fitting traps",
      "Detailed equity curve, Sharpe Ratio, and Drawdown reports",
      "Optimal parameter clusters for stable forward performance"
    ],
    badge: "Risk Mitigation",
    ctaText: "Test My Strategy"
  },
  {
    id: "vps-latency-tuning",
    title: "VPS & 24/7 Trading Infrastructure Setup",
    category: "Infrastructure",
    icon: "server",
    shortDesc: "Turnkey deployment of MetaTrader instances and Python bots on ultra-low latency Windows/Linux VPS servers.",
    detailedDesc: "Never miss a trade due to power outages or home internet failure. We configure hardened VPS environments, auto-start watchdogs, memory monitoring, and automated daily backup routines.",
    technologies: ["Windows Server", "Ubuntu Linux", "Docker", "Systemd Watchdogs", "RDP"],
    benefits: [
      "99.99% uptime trading reliability",
      "Sub-2ms broker cross-connect latency optimization",
      "Auto-restart on server reboot or terminal crashes",
      "Telegram bot health-check status alerts"
    ],
    badge: "24/7 Uptime",
    ctaText: "Setup VPS"
  },
  {
    id: "api-integrations",
    title: "Trading API Integrations & Webhook Bridges",
    category: "Integration",
    icon: "link-2",
    shortDesc: "Custom bridges connecting webhooks, signal services, CRM systems, and multi-broker liquidity providers.",
    detailedDesc: "Create seamless data pipelines between TradingView alerts, Telegram channels, custom web applications, and your trading terminals with encrypted authentication.",
    technologies: ["REST API", "WebSocket", "FastAPI", "Express.js", "MetaAPI"],
    benefits: [
      "Instant signal-to-order execution (< 50ms)",
      "Secure HMAC token signing and IP whitelisting",
      "Multi-broker simultaneous order distribution",
      "Real-time execution telemetry and audit trail"
    ],
    badge: "Custom Bridge",
    ctaText: "Build API Bridge"
  },
  {
    id: "bot-debugging-upgrades",
    title: "EA Debugging, Optimization & Feature Additions",
    category: "Refactoring",
    icon: "shield-check",
    shortDesc: "Fixing bugs, memory leaks, compilation errors, and adding modern features to existing EAs and scripts.",
    detailedDesc: "Have existing MQL4/MQL5 code that crashes, experiences requotes, or needs MT4-to-MT5 conversion? We refactor legacy codebases into clean, modular, and reliable trading software.",
    technologies: ["MQL4", "MQL5", "C++ DLL", "Code Profiler"],
    benefits: [
      "Complete MT4 to MT5 MQL conversion",
      "Elimination of array-out-of-range & memory leaks",
      "Addition of dynamic TP/SL, Breakeven, and News filter",
      "Speed optimization for backtesting efficiency"
    ],
    badge: "Refactoring",
    ctaText: "Fix My Code"
  }
];

if (typeof window !== 'undefined') {
  window.SERVICES_DATA = SERVICES_DATA;
}
