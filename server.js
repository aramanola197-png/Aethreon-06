process.on('uncaughtException', err => {
  console.error(err);
});

process.on('unhandledRejection', err => {
  console.error(err);
});

require('dotenv').config();
const path = require('path');
const express = require('express');
const compression = require('compression');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');

const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Global Performance & Parsing Middleware Stack
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));

// Session Management Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'aethreon-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 Week standard tracking
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Locals global view definitions
app.use((req, res, next) => {
  res.locals.brand = {
    name: 'AETHREON IQ',
    year: new Date().getFullYear(),
  };
  res.locals.path = req.path;
  res.locals.title = 'AETHREON IQ';
  res.locals.pageTitle = '';
  res.locals.user = req.user || null;
  next();
});

// Structural App Routes Mapping
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/home', (req, res) => {
  res.redirect('/');
});

// 404 Fallback Exception Handler
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Not Found · AETHREON IQ', pageTitle: '404' });
});

// System 500 Critical Error Handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).render('pages/500', {
    title: 'System Error · AETHREON IQ',
    pageTitle: 'System Error',
    message: err.message || 'Unexpected error',
  });
});

// Database Connection & Boot Verification Routine
async function start() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
      console.log('[mongo] connected');
    } catch (err) {
      console.warn('[mongo] connection failed — continuing without persistence:', err.message);
    }
  } else {
    console.warn('[mongo] MONGODB_URI not set — running without persistence');
  }
  app.listen(PORT, () => console.log(`AETHREON IQ running on :${PORT}`));
}

start();
