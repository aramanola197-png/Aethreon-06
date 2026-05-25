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
  bounties: num(
  (user.bountyStats?.totalSubmissions || 0) +
  (user.bountyStats?.totalCreated || 0)
),

  gigs: num(
    stats.gigsCompleted ??
    user.takenGigs?.length
  ),

  quests: num(
    stats.questsCompleted ??
    user.bountySubmissions?.length
  ),

  grants: num(
    stats.grantsReceived ??
    user.createdBounties?.length
  ),

  events: num(
    stats.eventsAttended ??
    user.createdBounties?.length
  ),

  reviews: num(
  stats.reviewCount ??
  user._count?.comments ??
  user.reactions?.length ??
  0
),

rating: num(
  stats.averageRating ??
  user.rating ??
  Math.min(
    5,
    (
      ((user.bountySubmissions?.length || 0) * 0.15) +
      ((user.wonBounties?.length || 0) * 1.2) +
      ((user.takenGigs?.length || 0) * 0.7) +
      ((user._count?.comments || 0) * 0.2)
    )
  ) ??
  0
),
  earnings: num(
    stats.totalEarnings ??
    user.totalEarnings ??
    (
      (user.wonBounties?.length || 0) * 50 +
      (user.takenGigs?.length || 0) * 100
    )
  ),

  daysActive: num(
  stats.daysActive ??
  (
    user.bountySubmissions?.length ||
    user.takenGigs?.length
      ? Math.max(
          1,
          Math.floor(
            (
              new Date() -
              new Date(
                user.bountySubmissions?.[0]?.createdAt ||
                user.createdAt
              )
            ) / (1000 * 60 * 60 * 24)
          )
        )
      : 0
  )
),
};
}

function computeScore(signals) {
  if (!signals) return { score: 0, tier: 'UNRANKED', breakdown: {} };
  const breakdown = {
  contribution: clamp(
    signals.bounties * 6 +
    signals.gigs * 5 +
    signals.quests * 4,
    0,
    200
  ),

  governance: clamp(
    signals.grants * 12 +
    signals.events * 3,
    0,
    200
  ),

  consistency: clamp(
    signals.daysActive * 0.4,
    0,
    200
  ),

  credibility: clamp(
    (
      signals.reviews * 6 +
      signals.rating * 30 +
      signals.bounties * 4 +
      signals.gigs * 8
    ),
    0,
    200
  ),

  economic: clamp(
    Math.log10(signals.earnings + 1) * 35,
    0,
    200
  )
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
