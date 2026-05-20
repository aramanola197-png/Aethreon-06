// Reputation scoring engine. Synthesizes a deterministic reputation profile
// from raw signals returned by the Zero Authority DAO API.

function num(v, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function deriveSignals(user) {
  if (!user) return null;
  const stats = user.stats || user.userStats || {};
  return {
    bounties: num(stats.bountiesCompleted ?? stats.completedBounties ?? user.bountiesCount),
    gigs: num(stats.gigsCompleted ?? user.gigsCount),
    quests: num(stats.questsCompleted ?? user.questsCount),
    grants: num(stats.grantsReceived ?? user.grantsCount),
    events: num(stats.eventsAttended ?? user.eventsCount),
    reviews: num(stats.reviewsCount ?? user.reviewsCount),
    rating: num(stats.averageRating ?? user.rating, 0),
    earnings: num(stats.totalEarnings ?? user.totalEarnings),
    daysActive: num(stats.daysActive ?? user.daysActive),
  };
}

function computeScore(signals) {
  if (!signals) return { score: 0, tier: 'UNRANKED', breakdown: {} };
  const breakdown = {
    contribution: clamp(signals.bounties * 6 + signals.gigs * 5 + signals.quests * 4, 0, 300),
    governance: clamp(signals.grants * 12 + signals.events * 3, 0, 180),
    consistency: clamp(signals.daysActive * 0.4, 0, 160),
    credibility: clamp(signals.reviews * 2 + signals.rating * 20, 0, 220),
    economic: clamp(Math.log10(signals.earnings + 1) * 35, 0, 140),
  };
  const raw = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const score = Math.round(clamp(raw, 0, 1000));
  const tier = tierOf(score);
  return { score, tier, breakdown };
}

function tierOf(score) {
  if (score >= 850) return 'OBSIDIAN';
  if (score >= 700) return 'TITAN';
  if (score >= 550) return 'PRIME';
  if (score >= 400) return 'OPERATIVE';
  if (score >= 200) return 'RECRUIT';
  if (score > 0) return 'INITIATE';
  return 'UNRANKED';
}

function tagsFor(signals, score) {
  const tags = [];
  if (!signals) return tags;
  if (signals.bounties >= 5) tags.push('Bounty Hunter');
  if (signals.gigs >= 5) tags.push('Service Provider');
  if (signals.quests >= 5) tags.push('Questor');
  if (signals.grants >= 1) tags.push('Grant Recipient');
  if (signals.events >= 3) tags.push('Community Contributor');
  if (signals.rating >= 4.5) tags.push('Highly Rated');
  if (signals.daysActive >= 180) tags.push('Long-Term Active');
  if (score >= 700) tags.push('Elite');
  return tags;
}

function buildProfile(user) {
  const signals = deriveSignals(user);
  const { score, tier, breakdown } = computeScore(signals);
  return {
    user,
    signals,
    score,
    tier,
    breakdown,
    tags: tagsFor(signals, score),
  };
}

module.exports = { buildProfile, computeScore, deriveSignals, tagsFor, tierOf };
