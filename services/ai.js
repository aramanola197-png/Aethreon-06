// AETHREON IQ — Intelligent AI Assistant Engine v2

const RESPONSES = {
  greetings: [
    "👋 Welcome to AETHREON IQ — your Web3 intelligence command center. Ask me about wallet analysis, reputation scoring, contributor discovery or platform navigation.",
    "⚡ Hello explorer. I can help you navigate AETHREON IQ, understand Web3 concepts, analyze wallets, or explain any platform feature. What do you need?",
    "🧠 AETHREON IQ Assistant online. I'm here to guide you through wallet intelligence, reputation scoring, ecosystem analytics and everything the platform offers.",
    "🚀 Welcome to AETHREON IQ. Ready to analyze the decentralized ecosystem? Ask me anything about the platform or Web3.",
    "✨ Hey there. I specialize in AETHREON IQ navigation, Web3 intelligence and contributor analytics. How can I assist?"
  ],

  unknown: [
    "🧠 I'm not sure I caught that — but I can help with: Wallet Intelligence, Reputation Scoring, Compare Wallets, Activity Feed, Analytics, Discover, Saved Searches, Exports or general Web3 concepts. Try rephrasing or ask about any of those.",
    "⚡ That's outside my current knowledge scope. I specialize in AETHREON IQ platform guidance and Web3 intelligence. Try asking about a specific feature like 'How do I scan a wallet?' or 'What is reputation scoring?'",
    "🚀 I didn't quite get that. You can ask me things like: 'How does reputation work?', 'What is Wallet Intelligence?', 'How do I compare wallets?', 'What is a DAO?' or 'How do I export results?'"
  ]
};

const TOPICS = [

  // ─────────────── Greetings / Identity ───────────────

  {
    keys: ['who are you', 'what are you', 'your name', 'what can you do', 'what do you do'],
    reply: `
🤖 I am the AETHREON IQ AI Assistant — built into the platform to help you navigate and get the most out of every feature.

I can help you with:

• 🧭 Platform navigation — finding the right tool for your goal
• 🔍 Wallet Intelligence — how to scan and interpret STX addresses
• 🏆 Reputation — understanding scores, tiers and scoring factors
• ⚔️ Compare Wallets — how to run side-by-side contributor analysis
• 📡 Activity Feed — filtering and reading live ecosystem activity
• 📈 Analytics — interpreting ecosystem-wide metrics
• 🌍 Discover — exploring and profiling contributors
• 💾 Saved Searches — storing and retrieving intelligence reports
• 🖼️ Exports — downloading branded intelligence cards
• 🌐 Web3 concepts — DAOs, blockchain, smart contracts and more

⚡ Just ask me anything and I'll guide you precisely.
`
  },

  // ─────────────── Project / About ───────────────

  {
    keys: ['aethreon', 'what is aethreon', 'about aethreon', 'about this', 'about the platform', 'platform', 'project', 'what is this'],
    reply: `
🚀 AETHREON IQ is a premium Web3 reputation intelligence platform.

It reads contributor activity across the Zero Authority DAO ecosystem and transforms raw blockchain and participation data into structured, professional-grade intelligence profiles.

🎯 Who is it for?
• DAO governance teams evaluating contributors
• Grant committees assessing applicant credibility
• Researchers studying Web3 ecosystem participation
• Contributors wanting to understand their on-chain reputation
• Communities building trust-based access systems

⚡ Core utilities:

1. 🔍 Wallet Intelligence — full contributor dossier from any STX address
2. 🏆 Reputation Scoring — 0–1000 score across 5 intelligence axes
3. ⚔️ Compare Wallets — side-by-side contributor comparison
4. 📡 Activity Feed — live ecosystem activity from all data sources
5. 📈 Analytics — ecosystem-wide metrics and platform statistics
6. 🌍 Discover — browse and profile active contributors
7. 💾 Saved Searches — persistent intelligence storage
8. 🖼️ Export — branded intelligence card downloads

🧠 Built on Zero Authority DAO API infrastructure with live data feeds.
`
  },

  // ─────────────── Navigation ───────────────

  {
    keys: ['navigate', 'navigation', 'where', 'how do i get to', 'how do i go to', 'find', 'menu', 'sidebar', 'go to', 'open'],
    reply: `
🧭 Here's how to navigate AETHREON IQ:

📌 Sidebar (left panel on desktop, hamburger menu on mobile):
• 🏠 Home — platform overview and quick access
• 🔍 Wallet Intelligence — scan any STX address
• 🏆 Reputation — run the reputation engine
• ⚔️ Compare Wallets — side-by-side analysis
• 📡 Activity — live ecosystem activity feed
• 📈 Analytics — ecosystem-wide statistics
• 🌍 Discover — browse contributors
• 💾 Saved Searches — your stored reports

📌 Top bar:
• 🔔 Bell icon — notifications panel
• 🚪 Logout — sign out of your session

📌 Floating button (bottom right):
• ✨ AI Assistant — that's me! Open anytime for guidance

⚡ Tip: On mobile, tap the ☰ hamburger icon at the top left to open the sidebar navigation.
`
  },

  // ─────────────── Wallet Intelligence ───────────────

  {
    keys: ['wallet intelligence', 'wallet scan', 'scan wallet', 'wallet lookup', 'wallet analysis', 'stx address', 'lookup', 'address scan', 'how do i scan'],
    reply: `
🔍 Wallet Intelligence is AETHREON IQ's core utility.

It takes any valid STX (Stacks blockchain) wallet address and generates a complete contributor intelligence profile — pulling data from across the Zero Authority DAO ecosystem.

📊 What the profile includes:
• Full reputation score (0–1000)
• Contributor tier classification
• Signal breakdown across 6 categories
• Score breakdown across 5 intelligence axes
• Activity tags and contributor labels
• Economic and governance signals

🚀 How to run a scan:
1. Click "Wallet Intelligence" in the sidebar
2. Paste a valid STX address in the input field
3. Tap the Execute / search button
4. Your intelligence profile generates instantly

💡 Tips:
• STX addresses typically start with SP or SM
• You can save the result after scanning
• You can export it as a branded intelligence card
• You can jump directly to Compare from any profile
`
  },

  // ─────────────── Reputation ───────────────

  {
    keys: ['reputation', 'score', 'scoring', 'tier', 'ranking', 'how is score calculated', 'reputation score', 'what is my score', 'how reputation works'],
    reply: `
🏆 The Reputation Engine scores contributors from 0 to 1000.

It evaluates five intelligence axes — each weighted and combined into a final score:

📊 Scoring breakdown:

1. 🔨 Contribution (max 200pts)
   Bounties completed, gigs delivered, quests finished, grants received

2. 🏛️ Governance (max 200pts)
   SIP voting participation, proposal activity, DAO engagement

3. 📅 Consistency (max 200pts)
   Days active, sustained participation over time, regular engagement

4. 🛡️ Credibility (max 200pts)
   Reviews received, ratings, peer recognition, trust signals

5. 💰 Economic (max 200pts)
   Financial participation, value contributed, economic ecosystem signals

🎯 Tier classifications:
• 800–1000 → Elite Contributor
• 600–799  → Established Contributor
• 400–599  → Active Contributor
• 200–399  → Emerging Contributor
• 0–199    → Early Contributor

⚡ To check reputation: go to the Reputation page, enter any STX address and tap Execute.
`
  },

  // ─────────────── Compare Wallets ───────────────

  {
    keys: ['compare', 'vs', 'versus', 'compare wallets', 'side by side', 'two wallets', 'compare two'],
    reply: `
⚔️ Compare Wallets lets you analyze two contributors head-to-head in real time.

🚀 How to use:
1. Go to Compare Wallets in the sidebar
2. Enter the first STX address in field A
3. Enter the second STX address in field B
4. Tap Execute

📊 The comparison shows both profiles side by side including:
• Reputation scores
• Tier classifications
• Signal breakdowns (bounties, gigs, quests, grants, events)
• Scoring axis comparisons
• Contributor tags

💡 Best use cases:
• Evaluating two grant applicants
• Comparing DAO contributors before a vote
• Assessing team members' ecosystem credibility
• Research and due diligence

You can also export the comparison as a branded intelligence card.
`
  },

  // ─────────────── Activity ───────────────

  {
    keys: ['activity', 'feed', 'live', 'events', 'bounties', 'gigs', 'quests', 'grants', 'activity feed'],
    reply: `
📡 The Activity Feed streams live ecosystem activity from the Zero Authority DAO data infrastructure.

⚡ Data sources available:
• 🎯 Bounties — posted and completed bounties
• 💼 Gigs — freelance and contributor gigs
• 🗺️ Quests — mission-based ecosystem tasks
• 🏦 Grants — funding opportunities and distributions
• 🎪 Events — ecosystem events and community activity

🚀 How to use:
1. Go to Activity in the sidebar
2. Use the filter chips at the top to select a data source
3. The feed auto-loads for that source
4. Tap any chip to switch between sources instantly

💡 Tips:
• Each source shows the 8 most recent items
• Items display title, description and status
• You can export an activity snapshot as a branded card
• Use this to monitor what's happening live in the ecosystem
`
  },

  // ─────────────── Analytics ───────────────

  {
    keys: ['analytics', 'metrics', 'stats', 'statistics', 'ecosystem stats', 'platform stats', 'numbers', 'data'],
    reply: `
📈 Analytics gives you a live ecosystem-wide intelligence snapshot.

📊 Metrics available:
• 👥 Total platform users & active users
• 💼 Total gigs & active gigs in motion
• 🗺️ Total quests & completed quests
• 🏛️ Total SIPs (Stacks Improvement Proposals) & open votes
• 🎯 Bounties posted
• 🏦 Active grants

🚀 How to use:
1. Go to Analytics in the sidebar
2. Data loads automatically on arrival
3. Tap the Refresh button to pull the latest snapshot

💡 All data is pulled live from connected Zero Authority DAO data sources — so values reflect the current state of the ecosystem in real time.

You can export analytics snapshots as branded intelligence cards.
`
  },

  // ─────────────── Discover ───────────────

  {
    keys: ['discover', 'explore', 'contributors', 'browse contributors', 'find contributors', 'who is active'],
    reply: `
🌍 Discover lets you surface and explore active contributors across the Zero Authority DAO ecosystem.

🚀 How to use:
1. Go to Discover in the sidebar
2. Contributors load automatically on arrival
3. Use the search field to filter by name or address
4. Tap any contributor card to open their full Wallet Intelligence profile

📊 Each contributor card shows:
• Display name or username
• STX wallet address

💡 Tapping a card instantly runs Wallet Intelligence on that address — so you go from discovery to a full reputation dossier in one tap.

Great for:
• Finding active ecosystem participants
• Researching contributors before engaging them
• DAO governance due diligence
• Building contributor shortlists
`
  },

  // ─────────────── Saved Searches ───────────────

  {
    keys: ['saved', 'save', 'saved searches', 'saved reports', 'store', 'how do i save', 'retrieve'],
    reply: `
💾 Saved Searches give you persistent intelligence storage across sessions.

🚀 How to save a result:
1. Run any analysis (Wallet Intelligence, Reputation, Compare, Activity, Analytics, Discover)
2. Scroll to the bottom of the result
3. Tap the "Save" button in the action row
4. The report is stored with a label and timestamp

📂 How to retrieve saved searches:
1. Go to Saved Searches in the sidebar
2. All your stored reports appear as cards
3. Tap any card to expand and view the full saved data
4. Use Export to re-download the intelligence card
5. Use Delete to remove reports you no longer need

💡 Notes:
• Saved searches require a MongoDB database connection on the server
• If persistence is offline, you'll see a notice — contact your server admin
• Reports survive page refreshes and browser restarts when the database is connected
`
  },

  // ─────────────── Export ───────────────

  {
    keys: ['export', 'download', 'card', 'image', 'share', 'branded', 'how do i export'],
    reply: `
🖼️ Export generates premium branded intelligence cards as downloadable PNG images.

Each utility creates its own unique visual export layout:

• 🔍 Wallet Intelligence → full contributor dossier card
• 🏆 Reputation → score + breakdown card
• ⚔️ Compare Wallets → dual-profile comparison card
• 📡 Activity → activity snapshot card
• 📈 Analytics → ecosystem metrics card
• 🌍 Discover → contributor discovery card

🚀 How to export:
1. Run any analysis
2. Tap the "Export" button in the action row below the result
3. The card generates instantly and downloads to your device

💡 Export cards include:
• AETHREON IQ branding and logo
• Gold-accented design
• Full intelligence data
• Timestamp

Perfect for sharing reports in Telegram groups, Discord servers, presentations or DAO documentation.
`
  },

  // ─────────────── Settings ───────────────

  {
    keys: ['settings', 'theme', 'dark mode', 'light mode', 'preferences', 'customize', 'toggle', 'animation'],
    reply: `
⚙️ Settings lets you personalize your AETHREON IQ experience.

🎨 Available options:
• 🌙 Dark mode — default dark theme
• ☀️ Light mode — bright interface theme
• 💻 System theme — follows your device's OS theme setting
• ✨ Background animations — toggle particle effects on/off
• 🔔 Notifications — enable or disable platform notifications
• 📦 Export quality — standard or high-quality image exports

🚀 How to access Settings:
→ Click the ⚙️ gear icon in the sidebar navigation

All preferences are saved locally to your browser and persist across sessions automatically.
`
  },

  // ─────────────── Notifications ───────────────

  {
    keys: ['notification', 'notifications', 'alert', 'bell', 'notif'],
    reply: `
🔔 Notifications track important platform events in real time.

You receive alerts for:
• ✅ Analysis completed successfully
• 💾 Search saved
• 🖼️ Export downloaded
• ⚠️ Analysis errors or failures
• 🔄 Activity feed refreshes
• 📊 Analytics snapshots

🚀 How to access:
→ Tap the bell icon 🔔 in the top bar

A blue dot appears on the bell when you have unread notifications. Opening the panel marks all as read automatically.

You can toggle notifications on/off in Settings if you prefer a quieter experience.
`
  },

  // ─────────────── Web3 ───────────────

  {
    keys: ['web3', 'blockchain', 'crypto', 'decentralized', 'what is web3', 'what is blockchain'],
    reply: `
🌐 Web3 is the decentralized evolution of the internet.

Unlike Web2 (where companies like Google, Meta and Amazon control your data and identity), Web3 uses:

• ⛓️ Blockchain — a shared, tamper-proof ledger of transactions and activity
• 📜 Smart contracts — self-executing code that runs without intermediaries
• 🏛️ DAOs — Decentralized Autonomous Organizations governed by token holders
• 🔑 Digital wallets — your identity and asset ownership on-chain
• 🌍 Transparency — all activity is publicly verifiable

🧠 How AETHREON IQ fits:
AETHREON IQ reads the public blockchain activity of STX wallet addresses and cross-references it with Zero Authority DAO participation data to build contributor intelligence profiles — turning anonymous wallets into readable contributor identities.

💡 STX (Stacks) is a Layer 2 blockchain built on top of Bitcoin, enabling smart contracts and DeFi while inheriting Bitcoin's security.
`
  },

  // ─────────────── DAO ───────────────

  {
    keys: ['dao', 'zero authority', 'zero authority dao', 'what is a dao', 'governance', 'voting', 'sip', 'proposal'],
    reply: `
🏛️ A DAO (Decentralized Autonomous Organization) is an organization governed by its community through on-chain voting — no central authority, no single owner.

Key concepts:
• 🗳️ Governance — members vote on proposals using tokens or reputation
• 📜 SIPs — Stacks Improvement Proposals, formal governance decisions on the Stacks blockchain
• 🎯 Bounties — tasks posted by the DAO for contributors to complete for rewards
• 💼 Gigs — freelance work opportunities within the ecosystem
• 🗺️ Quests — mission-based engagement activities
• 🏦 Grants — funding distributed to builders and contributors

🌐 Zero Authority DAO:
AETHREON IQ is powered by the Zero Authority DAO API infrastructure — which aggregates contributor activity from bounties, gigs, quests, grants, events and governance across its ecosystem.

This is the data source that drives every intelligence profile AETHREON IQ generates.
`
  },

  // ─────────────── STX / Stacks ───────────────

  {
    keys: ['stx', 'stacks', 'stacks blockchain', 'bitcoin layer', 'what is stx', 'what is stacks'],
    reply: `
⛓️ STX is the native token of the Stacks blockchain.

Stacks is a Layer 2 (L2) protocol built on top of Bitcoin that enables:
• 📜 Smart contracts (using the Clarity language)
• 🏦 DeFi (decentralized finance) applications
• 🌍 DAOs and governance systems
• 🔑 NFTs and digital ownership

🔑 STX wallet addresses typically start with SP or SM.

AETHREON IQ analyzes STX wallet addresses by pulling their activity from the Zero Authority DAO ecosystem — including bounties, gigs, quests, grants, events, reviews and governance participation.

💡 To analyze any STX address:
→ Go to Wallet Intelligence, paste the address and tap Execute.
`
  },

  // ─────────────── Errors / Troubleshooting ───────────────

  {
    keys: ['error', 'not working', 'failed', 'broken', 'issue', 'problem', 'cant find', "can't find", 'invalid', 'no result', 'nothing'],
    reply: `
⚠️ Let me help you troubleshoot.

Common issues and fixes:

🔍 "Could not locate STX address":
• Make sure the address starts with SP or SM
• Check for extra spaces before or after the address
• Confirm it's a valid Stacks blockchain address
• Some addresses may have no ecosystem activity yet

📡 Activity / Analytics not loading:
• The Zero Authority DAO API may be temporarily rate-limited
• Tap Refresh to retry the data fetch
• Check your internet connection

💾 Saved Searches not working:
• Saved Searches require a MongoDB database connection
• If you see a "persistence offline" message, the database is not connected on the server side

🖼️ Export not downloading:
• Make sure your browser allows file downloads from the site
• Try on a different browser if the issue persists

🤖 AI Terminal not responding:
• Check that the backend server is running
• Try refreshing the page

⚡ Still stuck? Try refreshing the page or clearing your browser cache.
`
  },

  // ─────────────── How to use / Getting started ───────────────

  {
    keys: ['how do i use', 'getting started', 'get started', 'how to start', 'first time', 'beginner', 'tutorial', 'guide', 'help me'],
    reply: `
🚀 Getting started with AETHREON IQ is simple. Here's the quickest path:

Step 1 — Find a wallet to analyze
• If you have an STX address ready, go to Wallet Intelligence
• If you want to explore, go to Discover and browse contributors

Step 2 — Run your first scan
• Paste the STX address into the input field
• Tap Execute
• Your intelligence profile appears in seconds

Step 3 — Explore the results
• Read the score, tier, signals and breakdown
• Tap Save to store the report
• Tap Export to download a branded intelligence card

Step 4 — Go deeper
• Use Reputation for a scoring-focused analysis
• Use Compare Wallets to evaluate two contributors side by side
• Use Activity to monitor live ecosystem events
• Use Analytics for ecosystem-wide metrics

💡 All features are in the sidebar. On mobile, tap ☰ to open the sidebar.

⚡ Ask me about any specific feature and I'll walk you through it in detail.
`
  },

  // ─────────────── AI Terminal ───────────────

  {
    keys: ['ai', 'assistant', 'terminal', 'ai terminal', 'chat', 'this', 'you'],
    reply: `
🤖 You're already using the AETHREON IQ AI Assistant!

This terminal is always accessible via the ✨ floating button at the bottom right of any page.

I can help you with:
• 🧭 Navigation — "How do I get to Analytics?"
• 🔍 Feature guidance — "How does Reputation scoring work?"
• 🌐 Web3 education — "What is a DAO?" / "What is STX?"
• ⚠️ Troubleshooting — "Why is my scan showing an error?"
• 📖 Platform explanations — "What does the tier system mean?"

⚡ Just type your question naturally and I'll respond with precise, detailed guidance.

The more specific your question, the more accurate my response will be.
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
    return "👋 Ask me about AETHREON IQ navigation, wallet intelligence, reputation scoring, Web3 concepts or any platform feature. I'm here to help.";
  }

  // greetings — exact and partial
  const greetWords = ['hi', 'hello', 'hey', 'yo', 'sup', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings', 'hiya'];
  if (greetWords.some(g => q === g || q.startsWith(g + ' ') || q.startsWith(g + '!'))) {
    return random(RESPONSES.greetings);
  }

  // score each topic by how many keys match — return best match
  let bestTopic = null;
  let bestScore = 0;

  for (const topic of TOPICS) {
    let score = 0;
    for (const k of topic.keys) {
      if (q.includes(k)) {
        // longer key matches are more specific — reward them
        score += k.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  if (bestTopic) {
    return bestTopic.reply.trim();
  }

  // fallback
  return random(RESPONSES.unknown);
}

module.exports = { answer };
