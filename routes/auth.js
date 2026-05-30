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

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render('auth/signup', {
        error: 'Account already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    req.login(user, (err) => {
      if (err) {
        return res.redirect('/auth/login');
      }

      return res.redirect('/');
    });

  } catch (err) {
    console.error(err);
    res.redirect('/auth/signup');
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.render('auth/login', {
        error: 'Account not found'
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.render('auth/login', {
        error: 'Invalid password'
      });
    }

    req.login(user, (err) => {
      if (err) {
        return res.render('auth/login', {
          error: 'Login failed'
        });
      }

      return res.redirect('/');
    });

  } catch (err) {
    console.error(err);

    return res.render('auth/login', {
      error: 'Login failed'
    });
  }
});

module.exports = router;