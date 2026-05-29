const express = require('express');
const router = express.Router();

const { ensureAuth } = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/gateway');
  }

  res.render('pages/home', {
    title: 'AETHREON IQ',
    pageTitle: 'Home'
  });
});

const PAGES = [
  {
    path: '/wallet-intelligence',
    view: 'pages/wallet-intelligence',
    title: 'Wallet Intelligence'
  },

  {
    path: '/reputation',
    view: 'pages/reputation',
    title: 'Reputation'
  },

  {
    path: '/compare-wallets',
    view: 'pages/compare-wallets',
    title: 'Compare Wallets'
  },

  {
    path: '/activity',
    view: 'pages/activity',
    title: 'Activity'
  },

  {
    path: '/analytics',
    view: 'pages/analytics',
    title: 'Analytics'
  },

  {
    path: '/discover',
    view: 'pages/discover',
    title: 'Discover'
  },

  {
    path: '/saved-searches',
    view: 'pages/saved-searches',
    title: 'Saved Searches'
  },

  {
    path: '/settings',
    view: 'pages/settings',
    title: 'Settings'
  }
];

for (const p of PAGES) {
  router.get(p.path, ensureAuth, (req, res) => {
    res.render(p.view, {
      title: `${p.title} • AETHREON IQ`,
      pageTitle: p.title
    });
  });
}

module.exports = router;