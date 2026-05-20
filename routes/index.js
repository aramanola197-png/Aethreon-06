const express = require('express');
const router = express.Router();

const PAGES = [
  { path: '/',                   view: 'pages/home',             title: 'AETHREON IQ — Web3 Intelligence Layer',          pageTitle: 'Home' },
  { path: '/wallet-intelligence',view: 'pages/wallet-intelligence', title: 'Wallet Intelligence · AETHREON IQ',            pageTitle: 'Wallet Intelligence' },
  { path: '/reputation',         view: 'pages/reputation',       title: 'Reputation · AETHREON IQ',                       pageTitle: 'Reputation' },
  { path: '/compare-wallets',    view: 'pages/compare-wallets',  title: 'Compare Wallets · AETHREON IQ',                  pageTitle: 'Compare Wallets' },
  { path: '/activity',           view: 'pages/activity',         title: 'Activity · AETHREON IQ',                         pageTitle: 'Activity' },
  { path: '/analytics',          view: 'pages/analytics',        title: 'Analytics · AETHREON IQ',                        pageTitle: 'Analytics' },
  { path: '/discover',           view: 'pages/discover',         title: 'Discover · AETHREON IQ',                         pageTitle: 'Discover' },
  { path: '/saved-searches',     view: 'pages/saved-searches',   title: 'Saved Searches · AETHREON IQ',                   pageTitle: 'Saved Searches' },
  { path: '/settings',           view: 'pages/settings',         title: 'Settings · AETHREON IQ',                         pageTitle: 'Settings' },
];

for (const p of PAGES) {
  router.get(p.path, (req, res) => res.render(p.view, { title: p.title, pageTitle: p.pageTitle }));
}

module.exports = router;
