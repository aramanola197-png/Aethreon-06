const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

router.get('/gateway', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('auth/gateway', {
    title: 'Welcome • AETHREON IQ',
    pageTitle: 'gateway'
  });
});

router.get('/login', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('auth/login', {
    title: 'Login • AETHREON IQ',
    pageTitle: 'login'
  });
});

router.get('/signup', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('auth/signup', {
    title: 'Sign Up • AETHREON IQ',
    pageTitle: 'signup'
  });
});

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/login'
  }),
  (req, res) => {
    return res.redirect('/');
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session?.destroy?.(() => {
      res.redirect('/auth/gateway');
    });
  });
});

module.exports = router;
