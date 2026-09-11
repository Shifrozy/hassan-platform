/**
 * ============================================================================
 * Digital Products & Trading Software Data Module
 * ============================================================================
 */

var PRODUCTS_DATA = window.PRODUCTS_DATA = [
  {
    id: "apex-trend-scalper-pro",
    name: "Apex Trend Scalper Pro",
    version: "v3.4.2",
    tagline: "Institutional Order-Flow Trend Scalping EA for MT5 & MT4",
    platform: "MT5 / MT4",
    platformBadge: "badge-mt5",
    category: "Expert Advisor",
    price: 349,
    priceFormatted: "$349",
    billingType: "One-Time License",
    rating: 4.9,
    reviewsCount: 38,
    image: "assets/images/products/apex-scalper.svg",
    badge: "Flagship EA",
    shortDesc: "High-frequency precision trend follower utilizing dynamic volatility channels and tick-volume order imbalances for Gold (XAUUSD), US30, and FX pairs.",
    features: [
      "Built-in News Filter (ForexFactory integration)",
      "Dynamic Multi-Tier Trailing Stop & Partial Close",
      "Spread and Slippage Protection Engine",
      "Prop-Firm Ready (Daily Equity Drawdown Protector)",
      "Supports Cent, Standard, ECN & Raw Accounts",
      "Lifetime Updates & Preset Configurations Included"
    ],
    supportedPairs: ["XAUUSD", "US30", "NAS100", "EURUSD", "GBPUSD"],
    minDeposit: "$500 (Standard) / $50 (Cent)",
    recommendedTimeframe: "M5 / M15",
    changelog: [
      "v3.4.2: Enhanced spread filter during high volatility CPI/NFP releases",
      "v3.4.0: Added proprietary Equity Guard auto-close feature for FTMO & FundedNext accounts",
      "v3.2.0: Optimized MQL5 execution speed by 35%"
    ]
  },
  {
    id: "titan-quantum-grid",
    name: "Titan Quantum Grid & Hedging Suite",
    version: "v2.8.0",
    tagline: "Statistical Mean-Reversion Grid with Dynamic Multi-Tier Hedging",
    platform: "MetaTrader 5",
    platformBadge: "badge-mt5",
    category: "Expert Advisor",
    price: 299,
    priceFormatted: "$299",
    billingType: "One-Time License",
    rating: 4.8,
    reviewsCount: 29,
    image: "assets/images/products/titan-grid.svg",
    badge: "Consistent Yield",
    shortDesc: "Smart mathematical grid algorithm that avoids toxic martingale compounding. Features dynamic ATR grid spacing and automated hedge locks during strong macro trends.",
    features: [
      "Non-linear ATR-based adaptive grid spacing",
      "Macro Trend Directional Lock (No fighting major trends)",
      "Automated Emergency Basket Hedge Protection",
      "Multi-currency correlation hedge analyzer",
      "Complete Visual On-Chart Control Panel & Statistics"
    ],
    supportedPairs: ["AUDCAD", "NZDCAD", "EURGBP", "GBPCAD"],
    minDeposit: "$1,000",
    recommendedTimeframe: "H1",
    changelog: [
      "v2.8.0: Integrated correlation matrix to prevent simultaneous basket drawdowns",
      "v2.5.0: Added custom visual dashboard on MT5 chart canvas"
    ]
  },
  {
    id: "ibkr-arbitrage-copier",
    name: "IBKR Multi-Account Copier & Arbitrage Engine",
    version: "v4.1.0",
    tagline: "Sub-Millisecond Trade Replication & Latency Arbitrage Engine",
    platform: "Python / IBKR",
    platformBadge: "badge-ibkr",
    category: "Python Software",
    price: 499,
    priceFormatted: "$499",
    billingType: "One-Time License",
    rating: 5.0,
    reviewsCount: 17,
    image: "assets/images/products/ibkr-copier.svg",
    badge: "Institutional Tool",
    shortDesc: "High-speed standalone Python application connecting to multiple Interactive Brokers TWS/Gateway sessions to replicate trades with custom risk multipliers.",
    features: [
      "Direct Socket API connection (< 5ms replication)",
      "Supports Equities, Options, Futures, and Forex",
      "Multi-Account Master/Slave with proportional balance scaling",
      "Built-in Desktop GUI (PyQt6) & Headless Server Mode",
      "Encrypted Telegram Trade Broadcasts & Error Logging"
    ],
    supportedPairs: ["Stocks", "Options", "Futures (ES/NQ)", "Forex"],
    minDeposit: "$5,000",
    recommendedTimeframe: "All Timeframes",
    changelog: [
      "v4.1.0: Support for complex multi-leg options spreads replication",
      "v4.0.0: Redesigned dark-mode monitoring dashboard with real-time PnL"
    ]
  },
  {
    id: "institutional-risk-guard",
    name: "Institutional Drawdown & Risk Guard",
    version: "v2.1.5",
    tagline: "Hard Equity Lock & Prop-Firm Rule Enforcement Utility",
    platform: "MT5 / MT4 / Python",
    platformBadge: "badge-success",
    category: "Risk Management",
    price: 149,
    priceFormatted: "$149",
    billingType: "One-Time License",
    rating: 4.9,
    reviewsCount: 45,
    image: "assets/images/products/risk-guard.svg",
    badge: "Essential Security",
    shortDesc: "Prevents account blowout by enforcing strict daily loss limits, maximum overall drawdown, trailing drawdowns, and blocking trading during emotional revenge episodes.",
    features: [
      "Daily Maximum Loss Equity Hard Lock",
      "Automated close of all open trades on breach",
      "Disable auto-trading & sound alarm on threshold reach",
      "Compatible with FTMO, The Funded Trader, MFF, FundedNext rules",
      "Password lock prevents trader from overriding limits mid-session"
    ],
    supportedPairs: ["All Instruments & Asset Classes"],
    minDeposit: "$100",
    recommendedTimeframe: "Universal",
    changelog: [
      "v2.1.5: Added support for floating profit trailing drawdown calculation",
      "v2.0.0: Multi-terminal server synchronization via local IPC"
    ]
  },
  {
    id: "prop-challenge-pass-ea",
    name: "Prop-Firm Challenge Pass Guard EA",
    version: "v1.9.0",
    tagline: "Conservative Target Progression Algorithm for Evaluation Accounts",
    platform: "MetaTrader 5",
    platformBadge: "badge-mt5",
    category: "Expert Advisor",
    price: 399,
    priceFormatted: "$399",
    billingType: "One-Time License",
    rating: 4.8,
    reviewsCount: 22,
    image: "assets/images/products/prop-guard.svg",
    badge: "Evaluation Special",
    shortDesc: "Designed specifically for Phase 1 & Phase 2 prop firm evaluations with micro-lot risk sizing, zero overnight holding risk, and fixed 1:2.5 risk-to-reward mechanics.",
    features: [
      "Strict 0.5% max risk per trade calculation",
      "Automatic Friday market close to prevent weekend gap risk",
      "Zero Martingale, Zero Grid, Zero Averaging Down",
      "High probability London & New York session breakout setups",
      "Auto-stops execution once target profit % is reached"
    ],
    supportedPairs: ["US30", "NAS100", "EURUSD", "GBPUSD"],
    minDeposit: "$10,000 (Challenge Size)",
    recommendedTimeframe: "M15",
    changelog: [
      "v1.9.0: Added New York session volatility filter",
      "v1.8.2: Enhanced dynamic spread guard"
    ]
  }
];

if (typeof window !== 'undefined') {
  window.PRODUCTS_DATA = PRODUCTS_DATA;
}
