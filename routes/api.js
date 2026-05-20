const express = require('express');
const mongoose = require('mongoose');
const zad = require('../services/zad');
const rep = require('../services/reputation');
const ai = require('../services/ai');
const SavedSearch = require('../models/SavedSearch');
const Notification = require('../models/Notification');

const router = express.Router();

const dbReady = () => mongoose.connection.readyState === 1;
const clientId = (req) => {
  const id = req.get('x-client-id') || req.body?.clientId || req.query?.clientId;
  if (!id || typeof id !== 'string' || id.length > 64) {
    const err = new Error('Missing client id'); err.status = 400; throw err;
  }
  return id;
};
const isStxAddress = (s) => typeof s === 'string' && /^S[A-Z0-9]{20,60}$/.test(s.trim());

// ───── Wallet intelligence ─────
router.get('/wallet/:address', async (req, res) => {
  const address = String(req.params.address || '').trim();
  if (!isStxAddress(address)) return res.status(400).json({ ok: false, message: 'Invalid STX address format' });
  const result = await zad.getUser(address);
  if (!result.ok) return res.status(result.status || 502).json({ ok: false, message: result.message });
  const profile = rep.buildProfile(result.data?.user || result.data);
  res.json({ ok: true, address, profile });
});

// ───── Reputation (same engine, exposed separately for clarity) ─────
router.get('/reputation/:address', async (req, res) => {
  const address = String(req.params.address || '').trim();
  if (!isStxAddress(address)) return res.status(400).json({ ok: false, message: 'Invalid STX address format' });
  const result = await zad.getUser(address);
  if (!result.ok) return res.status(result.status || 502).json({ ok: false, message: result.message });
  const profile = rep.buildProfile(result.data?.user || result.data);
  res.json({ ok: true, address, profile });
});

// ───── Compare two wallets ─────
router.get('/compare', async (req, res) => {
  const a = String(req.query.a || '').trim();
  const b = String(req.query.b || '').trim();
  if (!isStxAddress(a) || !isStxAddress(b)) return res.status(400).json({ ok: false, message: 'Both addresses must be valid STX format' });
  const [ra, rb] = await Promise.all([zad.getUser(a), zad.getUser(b)]);
  if (!ra.ok || !rb.ok) return res.status(502).json({ ok: false, message: ra.message || rb.message });
  res.json({
    ok: true,
    a: { address: a, profile: rep.buildProfile(ra.data?.user || ra.data) },
    b: { address: b, profile: rep.buildProfile(rb.data?.user || rb.data) },
  });
});

// ───── Activity feed ─────
router.get('/activity', async (req, res) => {
  const source = String(req.query.source || 'all');
  const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);
  const params = { limit };

  const sources = source === 'all'
    ? ['bounties', 'gigs', 'quests', 'grants', 'events']
    : [source];

  const map = {
    bounties: zad.listBounties, gigs: zad.listGigs, quests: zad.listQuests,
    grants: zad.listGrants, events: zad.listEvents,
  };
  const results = await Promise.all(sources.map(async (s) => {
    const fn = map[s]; if (!fn) return null;
    const r = await fn(params);
    return { source: s, ok: r.ok, items: r.ok ? extractList(r.data) : [], message: r.message };
  }));
  res.json({ ok: true, results: results.filter(Boolean) });
});

// ───── Analytics ─────
router.get('/analytics', async (req, res) => {
  const [platform, users, gigs, quests, sips] = await Promise.all([
    zad.platformStats(), zad.userStats(), zad.gigStats(), zad.questStats(), zad.sipStats(),
  ]);
  res.json({
    ok: true,
    platform: platform.data || null,
    users: users.data || null,
    gigs: gigs.data || null,
    quests: quests.data || null,
    sips: sips.data || null,
  });
});

// ───── Discover ─────
router.get('/discover', async (req, res) => {
  const q = String(req.query.q || '').trim();
  const result = q ? await zad.searchUsers(q) : await zad.listUsers({ limit: 24 });
  if (!result.ok) return res.status(result.status || 502).json({ ok: false, message: result.message });
  res.json({ ok: true, items: extractList(result.data) });
});

// ───── Saved searches ─────
router.get('/saved', async (req, res) => {
  if (!dbReady()) return res.json({ ok: true, items: [], offline: true });
  try {
    const cid = clientId(req);
    const items = await SavedSearch.find({ clientId: cid }).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ ok: true, items });
  } catch (err) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
});

router.post('/saved', async (req, res) => {
  if (!dbReady()) return res.status(503).json({ ok: false, message: 'Persistence offline' });
  try {
    const cid = clientId(req);
    const { utility, label, query, payload, tags } = req.body || {};
    if (!utility || !label) return res.status(400).json({ ok: false, message: 'utility and label required' });
    const doc = await SavedSearch.create({ clientId: cid, utility, label, query: query || {}, payload: payload || {}, tags: Array.isArray(tags) ? tags.slice(0, 10) : [] });
    res.json({ ok: true, item: doc });
  } catch (err) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
});

router.delete('/saved/:id', async (req, res) => {
  if (!dbReady()) return res.status(503).json({ ok: false, message: 'Persistence offline' });
  try {
    const cid = clientId(req);
    await SavedSearch.deleteOne({ _id: req.params.id, clientId: cid });
    res.json({ ok: true });
  } catch (err) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
});

// ───── Notifications ─────
router.get('/notifications', async (req, res) => {
  if (!dbReady()) return res.json({ ok: true, items: [], offline: true });
  try {
    const cid = clientId(req);
    const items = await Notification.find({ clientId: cid }).sort({ createdAt: -1 }).limit(50).lean();
    res.json({ ok: true, items });
  } catch (err) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
});

router.post('/notifications', async (req, res) => {
  if (!dbReady()) return res.status(503).json({ ok: false, message: 'Persistence offline' });
  try {
    const cid = clientId(req);
    const { tag, message } = req.body || {};
    if (!tag || !message) return res.status(400).json({ ok: false, message: 'tag and message required' });
    const doc = await Notification.create({ clientId: cid, tag: String(tag).slice(0, 32), message: String(message).slice(0, 240) });
    res.json({ ok: true, item: doc });
  } catch (err) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
});

router.post('/notifications/read-all', async (req, res) => {
  if (!dbReady()) return res.status(503).json({ ok: false, message: 'Persistence offline' });
  try {
    const cid = clientId(req);
    await Notification.updateMany({ clientId: cid, read: false }, { $set: { read: true } });
    res.json({ ok: true });
  } catch (err) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
});

// ───── AI assistant ─────
router.post('/ai', (req, res) => {
  const q = String(req.body?.question || '').slice(0, 500);
  res.json({ ok: true, reply: ai.answer(q) });
});

// ───── Helpers ─────
function extractList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  for (const k of ['items', 'data', 'results', 'users', 'bounties', 'gigs', 'quests', 'grants', 'events', 'rows']) {
    if (Array.isArray(data[k])) return data[k];
  }
  return [];
}

module.exports = router;
