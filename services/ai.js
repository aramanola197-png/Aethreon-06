// Rule-based assistant scoped strictly to AETHREON IQ navigation & utility guidance.
const TOPICS = [
  { keys: ['wallet', 'address', 'stx', 'lookup'], reply: 'Open Wallet Intelligence from the sidebar. Tap the search field, paste an STX address, and execute. You will see contributor signals, activity sources and a derived intelligence profile.' },
  { keys: ['reputation', 'score', 'tier'], reply: 'Reputation runs the AETHREON scoring engine on any STX address. Scores range 0–1000 across Contribution, Governance, Consistency, Credibility and Economic axes. Use Save to retain a profile or Export to download a branded card.' },
  { keys: ['compare', 'versus', 'vs'], reply: 'Use Compare Wallets to evaluate two STX addresses side-by-side. Each axis renders in parallel so you can spot edge differences instantly.' },
  { keys: ['activity', 'feed'], reply: 'Activity surfaces live bounties, gigs, quests, grants and events drawn directly from the Zero Authority DAO API. Filter by source from the chip rail.' },
  { keys: ['analytics', 'stats', 'metrics'], reply: 'Analytics aggregates platform-wide signals: total contributors, gigs in motion, governance SIPs and quest velocity. Refresh anytime — the data is live.' },
  { keys: ['discover', 'explore'], reply: 'Discover lists active contributors across the ecosystem. Open any contributor to route into a full Wallet Intelligence run.' },
  { keys: ['save', 'saved'], reply: 'Tap Save after any analysis to persist it. Saved entries live in Saved Searches and stay available across refresh and device restart.' },
  { keys: ['export', 'download', 'card'], reply: 'Export Data appears only after a successful analysis. Each utility generates its own unique branded card; tap Export to download it as an image to your device.' },
  { keys: ['settings', 'theme', 'dark', 'light', 'preferences'], reply: 'Settings holds theme controls (Dark / Light / System), background animation toggle and notification preferences. Your choices persist locally.' },
  { keys: ['ai', 'terminal', 'help'], reply: 'I am the AETHREON IQ assistant. I cover navigation and utility guidance for this platform only.' },
  { keys: ['notification', 'alert'], reply: 'Notifications appear top-center on successful analysis, save completion or system events. Open the bell icon for history; tap outside to dismiss.' },
];

function answer(question) {
  const q = String(question || '').toLowerCase().trim();
  if (!q) return 'Ask me how to use a utility — Wallet Intelligence, Reputation, Compare Wallets, Analytics, Discover, Saved Searches or Settings.';
  for (const t of TOPICS) if (t.keys.some(k => q.includes(k))) return t.reply;
  return 'I currently only assist with AETHREON IQ platform navigation and utility guidance.';
}

module.exports = { answer };
