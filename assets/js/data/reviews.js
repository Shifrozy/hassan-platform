/**
 * ============================================================================
 * Client Reviews & Testimonials Data Module
 * ============================================================================
 */

const REVIEWS_DATA = [
  {
    id: "rev-1",
    clientName: "David K.",
    country: "United States",
    countryCode: "US",
    role: "Prop Firm Trader & Fund Manager",
    serviceUsed: "MT5 Expert Advisor Development",
    rating: 5,
    date: "August 2024",
    avatar: "DK",
    comment: "Hassan is by far the most competent MQL5 developer I have worked with in 8 years of algorithmic trading. He took my complex discretionary strategy, identified edge cases I hadn't even considered, and delivered a flawless EA that passed my $200k prop challenge with zero bugs.",
    verified: true
  },
  {
    id: "rev-2",
    clientName: "Marcus Vance",
    country: "United Kingdom",
    countryCode: "GB",
    role: "Quantitative Analyst",
    serviceUsed: "Python & IBKR Automation",
    rating: 5,
    date: "July 2024",
    avatar: "MV",
    comment: "Exceptional Python coding skills. He built an automated options execution system connected to Interactive Brokers that handles high volatility effortlessly. Clean code, comprehensive documentation, and prompt communication. Highly recommended.",
    verified: true
  },
  {
    id: "rev-3",
    clientName: "Siddharth Mehta",
    country: "United Arab Emirates",
    countryCode: "AE",
    role: "Asset Management Director",
    serviceUsed: "TradingView Webhook & MetaAPI Bridge",
    rating: 5,
    date: "June 2024",
    avatar: "SM",
    comment: "We needed a sub-second webhook execution engine to broadcast TradingView signals to 100+ MT5 client accounts. Hassan delivered ahead of schedule and the system has been running with 99.99% uptime for months. A true technical partner.",
    verified: true
  },
  {
    id: "rev-4",
    clientName: "Johannes Weber",
    country: "Germany",
    countryCode: "DE",
    role: "Forex Scalper",
    serviceUsed: "Apex Trend Scalper Pro Product",
    rating: 5,
    date: "May 2024",
    avatar: "JW",
    comment: "The Apex Trend Scalper EA is phenomenal on Gold (XAUUSD). The news filter and dynamic trailing stop protected my account during the CPI volatility while still locking in solid gains. Top tier software quality.",
    verified: true
  },
  {
    id: "rev-5",
    clientName: "Liam O'Connor",
    country: "Australia",
    countryCode: "AU",
    role: "Crypto Systems Trader",
    serviceUsed: "Crypto Arbitrage Bot Development",
    rating: 5,
    date: "April 2024",
    avatar: "LO",
    comment: "Hassan built an asynchronous Python bot for Bybit and Binance with ccxt. His deep understanding of order books, latency mitigation, and WebSocket handlers set him apart from regular developers. Will definitely hire again.",
    verified: true
  },
  {
    id: "rev-6",
    clientName: "Alexandre Dubois",
    country: "France",
    countryCode: "FR",
    role: "Discretionary & Algo Trader",
    serviceUsed: "EA Optimization & Bug Fixing",
    rating: 5,
    date: "March 2024",
    avatar: "AD",
    comment: "My existing MT4 EA had severe memory leaks and was freezing during backtests. Hassan completely refactored it into clean MQL5, reduced execution times by 40%, and added an intuitive on-chart dashboard. Superb work!",
    verified: true
  }
];

if (typeof window !== 'undefined') {
  window.REVIEWS_DATA = REVIEWS_DATA;
}
