const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

// 1. Keep gateway pointing to your sleek auth/login setup
router.get('/gateway', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('auth/login', {
    title: 'Welcome • AETHREON IQ',
    pageTitle: 'gateway'
  });
});

// 2. Fallback: If someone manually visits /auth/login, route them to /gateway
router.get('/login', (req, res) => {
  return res.redirect('/auth/gateway');
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
        if (req.session) {
            req.session.destroy(() => {
                res.redirect('/'); // 🔥 Changed from '/auth/gateway' to '/'
            });
        } else {
            res.redirect('/'); // 🔥 Changed from '/auth/gateway' to '/'
        }
    });
});

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render('auth/signup', { error: 'Account already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    req.login(user, (err) => {
      if (err) return res.redirect('/auth/login');
      return res.redirect('/');
    });

  } catch (err) {
    console.error(err);
    res.redirect('/auth/signup');
  }
});

// 3. Updated POST route with the "Remember Me" persistent cookie check
router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body; // Added rememberMe extraction

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', { error: 'Account not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.render('auth/login', { error: 'Invalid password' });
    }

    req.login(user, (err) => {
      if (err) {
        return res.render('auth/login', { error: 'Login failed' });
      }

      // Drop cookie if checkbox was checked
      if (rememberMe) {
        res.cookie('aethreon_session_persistent', true, { 
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days expiration safety net
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        });
      }

      return res.redirect('/');
    });

  } catch (err) {
    console.error(err);
    return res.render('auth/login', { error: 'Login failed' });
  }
});

module.exports = router;
