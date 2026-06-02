const express = require('express');
const router = express.Router();

const { ensureAuth } = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  // If they are already authenticated, send them straight to the inner platform home
  if (req.user) {
    return res.render('pages/home', {
      title: 'AETHREON IQ',
      pageTitle: 'Home'
    });
  }
  
  // Otherwise, render your brand new public landing page!
  res.render('landing', {
    title: 'AETHREON IQ — Advanced Intelligence Platform',
    pageTitle: 'Welcome'
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