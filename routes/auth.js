const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GATEWAY PAGE
|--------------------------------------------------------------------------
*/

router.get('/gateway', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }

  res.render('auth/gateway', {
    title: 'Welcome • AETHREON IQ',
    pageTitle: 'gateway'
  });
});

/*
|--------------------------------------------------------------------------
| LOGIN PAGE
|--------------------------------------------------------------------------
*/

router.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }

  res.render('auth/login', {
    title: 'Login • AETHREON IQ',
    pageTitle: 'login'
  });
});

/*
|--------------------------------------------------------------------------
| SIGNUP PAGE
|--------------------------------------------------------------------------
*/

router.get('/signup', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }

  res.render('auth/signup', {
    title: 'Sign Up • AETHREON IQ',
    pageTitle: 'signup'
  });
});

/*
|--------------------------------------------------------------------------
| EMAIL SIGNUP
|--------------------------------------------------------------------------
*/

router.post('/signup', async (req, res) => {
  try {
    const {
      username,
      email,
      password
    } = req.body;
    
     console.log(req.body);

    const exists = await User.findOne({
      $or: [
        { email },
        { username }
      ]
    });

    if (exists) {
  return res.render('auth/signup', {
    title: 'Sign Up • AETHREON IQ',
    pageTitle: 'signup',
    error: 'User already exists'
  });
}

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed
    });
        console.log('USER SAVED:', user);

    req.login(user, err => {
      if (err) {
        console.error(err);
      }

      return res.redirect('/');
    });

  } catch (err) {
    console.error(err);
    return res.redirect('/auth/signup');
  }
});

/*
|--------------------------------------------------------------------------
| EMAIL LOGIN
|--------------------------------------------------------------------------
*/

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
   return res.render('auth/login', {
      title: 'Login · AETHREON IQ',
      pageTitle: 'login',
      error: 'Account does not exist'
   });
}

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
   return res.render('auth/login', {
      title: 'Login · AETHREON IQ',
      pageTitle: 'login',
      error: 'Invalid email or password'
   });
}

    req.login(user, err => {
      if (err) {
        console.error(err);
      }

      return res.redirect('/');
    });

  } catch (err) {
    console.error(err);
    return res.redirect('/auth/login');
  }
});

/*
|--------------------------------------------------------------------------
| GOOGLE AUTH
|--------------------------------------------------------------------------
*/

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',

  passport.authenticate('google', {
    failureRedirect: '/auth/login'
  }),

  (req, res) => {
    res.redirect('/home');
  }
);

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/auth');
  });
});

module.exports = router;