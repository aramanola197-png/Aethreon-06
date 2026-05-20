// AETHREON IQ — Intelligent AI Assistant Engine

const RESPONSES = {
  greetings: [
    "👋 Welcome to AETHREON IQ — your Web3 intelligence command center.",
    "⚡ Hello explorer. Ready to analyze the decentralized world?",
    "🧠 AETHREON IQ online. How may I assist you today?",
    "🚀 Welcome back to AETHREON IQ.",
    "✨ Hey there. Need insights, analytics or ecosystem intelligence?"
  ],

  unknown: [
    "🧠 I couldn't fully understand that request yet — but I can help with AETHREON IQ tools, Web3 analytics, wallet intelligence, ecosystem discovery and platform navigation.",
    "⚡ Try asking about Wallet Intelligence, Reputation, Compare Wallets, Discover, Analytics, Web3 or the AETHREON ecosystem.",
    "🚀 I currently specialize in Web3 intelligence, contributor analytics and AETHREON IQ platform guidance."
  ]
};

const TOPICS = [

  // ───────────────── Project ─────────────────

  {
    keys: ['aethreon', 'project', 'platform', 'what is aethreon', 'about'],
    reply: `
🚀 AETHREON IQ is a premium Web3 reputation intelligence platform designed to analyze contributor activity, governance participation and ecosystem trust signals across decentralized networks.

Using the Zero Authority DAO API infrastructure, AETHREON IQ transforms raw blockchain and contributor activity into actionable intelligence.

✨ Core capabilities include:

• Wallet Intelligence
• Reputation Scoring
• Contributor Discovery
• Governance Analytics
• Ecosystem Metrics
• Activity Monitoring
• Saved Intelligence Reports
• Branded Data Exports

🧠 The platform is designed for DAOs, contributors, researchers, governance teams and Web3 communities seeking high-quality intelligence and transparency.
`
  },

  // ───────────────── Wallet Intelligence ─────────────────

  {
    keys: ['wallet', 'address', 'lookup', 'stx'],
    reply: `
🧠 Wallet Intelligence analyzes STX wallet addresses and transforms blockchain activity into a readable contributor profile.

⚡ Features include:
• Contributor scoring
• Governance participation
• Gig & bounty activity
• Quest history
• Credibility metrics
• Economic signals
• Trust analysis

📌 To use:
1. Open Wallet Intelligence
2. Paste a valid STX address
3. Tap Execute

AETHREON IQ will generate a complete intelligence profile instantly.
`
  },

  // ───────────────── Reputation ─────────────────

  {
    keys: ['reputation', 'score', 'tier', 'ranking'],
    reply: `
🏆 Reputation Engine evaluates contributors across multiple weighted intelligence categories.

📊 Reputation factors:
• Contribution
• Governance
• Consistency
• Credibility
• Economic activity

⚡ Final scores range from 0 → 1000.

Higher scores indicate stronger ecosystem trust, participation and long-term contributor quality.

You can also:
• Save reports
• Export branded cards
• Compare reputation profiles
`
  },

  // ───────────────── Compare ─────────────────

  {
    keys: ['compare', 'vs', 'versus'],
    reply: `
⚔️ Compare Wallets lets you analyze two contributors side-by-side in real time.

📊 Comparison includes:
• Reputation score
• Governance activity
• Contribution strength
• Consistency
• Credibility
• Ecosystem participation

Perfect for DAO reviews, contributor analysis and ecosystem intelligence workflows.
`
  },

  // ───────────────── Activity ─────────────────

  {
    keys: ['activity', 'feed', 'events', 'gigs', 'quests', 'grants'],
    reply: `
📡 Activity Feed streams live ecosystem activity directly from the Zero Authority DAO infrastructure.

⚡ Sources include:
• Bounties
• Gigs
• Quests
• Grants
• Events

Use the source filter chips to isolate specific activity categories instantly.
`
  },

  // ───────────────── Analytics ─────────────────

  {
    keys: ['analytics', 'metrics', 'stats', 'statistics'],
    reply: `
📈 Analytics provides a live ecosystem-wide intelligence snapshot.

📊 Available metrics:
• Total contributors
• Governance activity
• Active gigs
• Quest velocity
• SIP statistics
• Platform growth
• Contributor engagement

All analytics are refreshed live from connected ecosystem data sources.
`
  },

  // ───────────────── Discover ─────────────────

  {
    keys: ['discover', 'explore', 'contributors'],
    reply: `
🌍 Discover helps you explore active Web3 contributors across the ecosystem.

You can:
• Browse contributors
• Open intelligence profiles
• Analyze contributor reputation
• Navigate directly into wallet intelligence scans

AETHREON IQ makes contributor discovery seamless and intelligent.
`
  },

  // ───────────────── Saved ─────────────────

  {
    keys: ['saved', 'save'],
    reply: `
💾 Saved Searches allows persistent intelligence storage.

After running any analysis:
• Tap Save
• Store the report locally/database
• Reopen it anytime later

Saved reports survive refreshes and device restarts.
`
  },

  // ───────────────── Export ─────────────────

  {
    keys: ['export', 'download', 'card'],
    reply: `
🖼️ Export generates premium branded intelligence cards.

Each utility creates a unique visual export including:
• Wallet profiles
• Reputation reports
• Analytics snapshots
• Activity summaries
• Contributor discovery cards

Exports download directly as high-quality images.
`
  },

  // ───────────────── Settings ─────────────────

  {
    keys: ['settings', 'theme', 'dark', 'light', 'preferences'],
    reply: `
⚙️ Settings lets you personalize your AETHREON IQ experience.

Available controls:
• Dark mode
• Light mode
• System theme
• Background animation toggle
• Notification preferences

Preferences are stored locally for persistent customization.
`
  },

  // ───────────────── Notifications ─────────────────

  {
    keys: ['notification', 'notifications', 'alert'],
    reply: `
🔔 Notifications track important platform events.

You receive alerts for:
• Completed analyses
• Saved reports
• Exports
• System activity
• Platform events

Open the bell icon anytime to review notification history.
`
  },

  // ───────────────── Web3 ─────────────────

  {
    keys: ['web3', 'blockchain', 'dao', 'crypto'],
    reply: `
🌐 Web3 represents the decentralized evolution of the internet.

Instead of centralized platforms controlling data and systems, Web3 uses:
• Blockchain networks
• Smart contracts
• Decentralized governance
• Digital ownership
• Transparent ecosystems

AETHREON IQ operates within this ecosystem by providing contributor intelligence, reputation analysis and decentralized analytics infrastructure.
`
  },

  // ───────────────── AI ─────────────────

  {
    keys: ['ai', 'assistant', 'terminal', 'help'],
    reply: `
🤖 I am the AETHREON IQ AI Assistant.

I can help you with:
• Platform navigation
• Wallet analysis guidance
• Reputation systems
• Contributor discovery
• Analytics explanation
• Web3 concepts
• Ecosystem intelligence

⚡ Ask me anything related to AETHREON IQ or Web3.
`
  }
];

// ───────────────── Engine ─────────────────

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function answer(question) {
  const q = String(question || '').toLowerCase().trim();

  if (!q) {
    return "👋 Ask me about AETHREON IQ, Web3 analytics, contributor reputation, wallet intelligence or ecosystem discovery.";
  }

  // greetings
  const greetings = ['hi', 'hello', 'hey', 'yo', 'sup', 'good morning', 'good afternoon', 'good evening'];

  if (greetings.includes(q)) {
    return random(RESPONSES.greetings);
  }

  // topic matching
  for (const topic of TOPICS) {
    if (topic.keys.some(k => q.includes(k))) {
      return topic.reply.trim();
    }
  }

  // fallback
  return random(RESPONSES.unknown);
}

module.exports = { answer };