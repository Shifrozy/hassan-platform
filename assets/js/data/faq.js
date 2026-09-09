/**
 * ============================================================================
 * Frequently Asked Questions (FAQ) Data Module
 * ============================================================================
 */

const FAQ_DATA = [
  {
    question: "Do you deliver the full source code (MQ4/MQ5/Python files)?",
    answer: "Yes, for custom development projects, you receive the complete, well-commented source code (.mq5, .mq4, or .py) along with the compiled files (.ex5/.ex4) and comprehensive setup instructions. You retain 100% intellectual property ownership of your strategy."
  },
  {
    question: "Can you sign a Non-Disclosure Agreement (NDA) to protect my strategy?",
    answer: "Absolutely. I take intellectual property and proprietary trading strategies very seriously. I am happy to review and sign a mutual NDA before you share any confidential rules, algorithms, or indicators."
  },
  {
    question: "How do we ensure the EA or bot doesn't fail on a live broker?",
    answer: "Every EA and bot is built with defensive coding practices: automated slippage guards, spread filters, requote retry mechanics, disconnect watchdogs, and maximum daily equity loss locks. We conduct rigorous tick-data backtests and forward demo tests before live deployment."
  },
  {
    question: "Can your EAs be used on Prop Firm challenges (FTMO, FundedNext, etc.)?",
    answer: "Yes. I specialize in developing prop-firm compliant algorithms equipped with daily equity loss protectors, maximum drawdown locks, news-event filters, and overnight risk management to ensure strict compliance with challenge rules."
  },
  {
    question: "What is your typical project delivery timeline and process?",
    answer: "Most custom EA development projects take between 3 to 7 business days depending on complexity. The process begins with requirement gathering & pseudocode verification, followed by core development, rigorous multi-timeframe backtesting, and final deployment assistance on your MT4/MT5 terminal or VPS."
  },
  {
    question: "Do you provide post-delivery support and bug fixes?",
    answer: "Yes, all custom development includes 30 days of complimentary post-delivery warranty and technical support to guarantee that your bot functions exactly as specified in your project brief."
  }
];

if (typeof window !== 'undefined') {
  window.FAQ_DATA = FAQ_DATA;
}
