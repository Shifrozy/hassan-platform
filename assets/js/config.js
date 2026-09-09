/**
 * ============================================================================
 * Hassan Platform - Global Site Configuration
 * ============================================================================
 * Centralized settings for branding, contact links, social profiles, and SEO.
 * Modify this file to update site-wide information without editing HTML files.
 */

const SITE_CONFIG = {
  brand: {
    name: "Hassan Platform",
    tagline: "Quantitative Trading & Automation Specialist",
    shortBio: "Developing institutional-grade MetaTrader 4/5 EAs, Python algorithmic trading bots, and Interactive Brokers API automations for global traders & funds.",
    logoText: "HASSAN",
    logoHighlight: "PRO",
    statusText: "AVAILABLE FOR CUSTOM EA & BOT PROJECTS",
    foundedYear: 2020
  },

  author: {
    name: "M. Hassan",
    title: "Senior Algorithmic Trading Systems Engineer & Full-Stack Developer",
    location: "Global / Remote Solutions",
    experienceYears: "6+",
    completedProjects: "140+",
    satisfiedClients: "95+",
    totalAutomatedVolume: "$45M+"
  },

  contact: {
    email: "contact@hassanplatform.com",
    telegram: "@hassan_trading_dev",
    telegramUrl: "https://t.me/hassan_trading_dev",
    whatsapp: "+1 (555) 019-8234",
    whatsappUrl: "https://wa.me/15550198234",
    githubUrl: "https://github.com/Shifrozy/hassan-platform",
    linkedinUrl: "https://linkedin.com",
    discordUrl: "https://discord.com",
    responseTime: "< 4 Hours"
  },

  meta: {
    siteUrl: "https://hassanplatform.com",
    ogImage: "assets/images/brand/og-preview.png",
    twitterHandle: "@hassan_algo"
  },

  technologies: [
    { name: "MQL5 / MT5", category: "Trading Platform", level: "Expert" },
    { name: "MQL4 / MT4", category: "Trading Platform", level: "Expert" },
    { name: "Python 3", category: "Algorithmic Development", level: "Advanced" },
    { name: "IBKR API", category: "Broker Integration", level: "Specialist" },
    { name: "ccxt / Crypto", category: "API Exchange", level: "Advanced" },
    { name: "MetaAPI", category: "Cloud Execution", level: "Specialist" },
    { name: "Pandas / NumPy", category: "Data & Backtesting", level: "Advanced" },
    { name: "Docker & Linux VPS", category: "DevOps & Deployment", level: "Advanced" }
  ]
};

// Export to window object for global browser access
if (typeof window !== 'undefined') {
  window.SITE_CONFIG = SITE_CONFIG;
}
