/**
 * ============================================================================
 * Hassan Platform - Global Site Configuration
 * ============================================================================
 * Centralized settings for branding, contact links, social profiles, and SEO.
 * Modify this file or use the Admin Panel to update site-wide information.
 * ============================================================================
 */

var SITE_CONFIG = {
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
