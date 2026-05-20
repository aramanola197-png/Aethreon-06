const axios = require('axios');

const BASE = process.env.ZAD_API_BASE || 'https://zeroauthoritydao.com/api';

const client = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Accept': 'application/json', 'User-Agent': 'AETHREON-IQ/1.0' },
});

async function safeGet(path, params) {
  try {
    const { data } = await client.get(path, { params });
    return { ok: true, data };
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message;
    return { ok: false, status, message };
  }
}

module.exports = {
  // Users / wallets
  listUsers: (params) => safeGet('/users', params),
  getUser: (stxAddress) => safeGet(`/users/${encodeURIComponent(stxAddress)}`),
  searchUsers: (q) => safeGet('/users/search', { q }),
  userStats: () => safeGet('/users/stats'),

  // Activity sources
  listBounties: (params) => safeGet('/bounties', params),
  listGigs: (params) => safeGet('/gigs', params),
  listQuests: (params) => safeGet('/quests', params),
  listGrants: (params) => safeGet('/grants', params),
  listEvents: (params) => safeGet('/events', params),

  // Governance
  listSips: (params) => safeGet('/sips', params),
  sipStats: () => safeGet('/sips/stats'),

  // Aggregates
  platformStats: () => safeGet('/stats'),
  gigStats: () => safeGet('/gigs/stats'),
  questStats: () => safeGet('/quest/stats'),
};
