/**
 * ============================================================================
 * Portfolio & Case Studies Data Module
 * ============================================================================
 */

var PORTFOLIO_DATA = window.PORTFOLIO_DATA = [
  {
    id: "gold-institutional-scalper",
    title: "Institutional Gold (XAUUSD) High-Frequency EA",
    category: "MetaTrader",
    categoryLabel: "MT5 Expert Advisor",
    clientType: "Private Prop Trader (Switzerland)",
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
    status: "Active on Live Account"
  },
  {
    id: "crypto-cross-exchange-arbitrage",
    title: "Cross-Exchange Crypto Statistical Arbitrage Bot",
    category: "Python",
    categoryLabel: "Python Trading Bot",
    clientType: "Family Office (Singapore)",
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
    status: "Production Cloud Cluster"
  },
  {
    id: "ibkr-options-volatility-harvester",
    title: "IBKR Automated Delta-Neutral Options Engine",
    category: "Interactive Brokers",
    categoryLabel: "IBKR Automation",
    clientType: "Registered Investment Advisor (USA)",
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
    status: "Live Institutional Deployment"
  },
  {
    id: "tradingview-metaapi-copier",
    title: "TradingView Webhook to Multi-Broker Execution Cloud",
    category: "API Integration",
    categoryLabel: "Cloud API Bridge",
    clientType: "Signal Provider Community (UK)",
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
    status: "Enterprise SaaS Architecture"
  }
];

if (typeof window !== 'undefined') {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
