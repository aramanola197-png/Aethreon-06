require('dotenv').config();
const path = require('path');
const express = require('express');
const compression = require('compression');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');

const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));

// Locals available to every view
app.use((req, res, next) => {
  res.locals.brand = {
    name: 'AETHREON IQ',
    year: new Date().getFullYear(),
  };
  res.locals.path = req.path;
  res.locals.title = 'AETHREON IQ';
  res.locals.pageTitle = '';
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/api', apiRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Not Found · AETHREON IQ', pageTitle: '404' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).render('pages/500', {
    title: 'System Error · AETHREON IQ',
    pageTitle: 'System Error',
    message: err.message || 'Unexpected error',
  });
});

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
