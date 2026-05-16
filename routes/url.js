const express  = require('express');
const router   = express.Router();
const { nanoid } = require('nanoid');
const URL      = require('../models/URL');
const { ensureAuth } = require('../middleware/auth');

// ── SHORTEN URL ───────────────────────────────────────────────────────────────
router.post('/shorten', ensureAuth, async (req, res) => {
  let { originalUrl, customAlias, expiresIn } = req.body;

  // Basic URL validation
  try { new URL(originalUrl); } catch {
    if (!/^https?:\/\//i.test(originalUrl)) originalUrl = 'https://' + originalUrl;
  }

  try {
    const shortCode = nanoid(6);

    // Check custom alias uniqueness
    if (customAlias) {
      customAlias = customAlias.trim().replace(/\s+/g, '-').toLowerCase();
      const existing = await URL.findOne({ $or: [{ shortCode: customAlias }, { customAlias }] });
      if (existing) {
        req.flash('error', 'That custom alias is already taken. Try another.');
        return res.redirect('/dashboard');
      }
    }

    // Calculate expiry
    let expiresAt = null;
    if (expiresIn && expiresIn !== 'never') {
      const days = parseInt(expiresIn);
      expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    const url = new URL({
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
      user: req.user._id,
      expiresAt,
    });

    await url.save();
    req.flash('success', 'Short URL created successfully!');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Try again.');
    res.redirect('/dashboard');
  }
});

// ── ANALYTICS PAGE ────────────────────────────────────────────────────────────
router.get('/analytics/:id', ensureAuth, async (req, res) => {
  try {
    const url = await URL.findOne({ _id: req.params.id, user: req.user._id });
    if (!url) return res.redirect('/dashboard');

    // Aggregate click data for charts
    const clicksByDay   = aggregateByDay(url.clicks);
    const clicksByBrowser = aggregateBy(url.clicks, 'browser');
    const clicksByOS      = aggregateBy(url.clicks, 'os');
    const clicksByDevice  = aggregateBy(url.clicks, 'device');

    res.render('analytics', {
      url,
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      clicksByDay:     JSON.stringify(clicksByDay),
      clicksByBrowser: JSON.stringify(clicksByBrowser),
      clicksByOS:      JSON.stringify(clicksByOS),
      clicksByDevice:  JSON.stringify(clicksByDevice),
    });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

// ── TOGGLE ACTIVE ─────────────────────────────────────────────────────────────
router.post('/toggle/:id', ensureAuth, async (req, res) => {
  try {
    const url = await URL.findOne({ _id: req.params.id, user: req.user._id });
    if (url) { url.isActive = !url.isActive; await url.save(); }
    res.redirect('/dashboard');
  } catch (err) {
    res.redirect('/dashboard');
  }
});

// ── DELETE ────────────────────────────────────────────────────────────────────
router.post('/delete/:id', ensureAuth, async (req, res) => {
  try {
    await URL.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    req.flash('success', 'URL deleted.');
    res.redirect('/dashboard');
  } catch (err) {
    res.redirect('/dashboard');
  }
});

// ── HELPERS ───────────────────────────────────────────────────────────────────
function aggregateByDay(clicks) {
  const map = {};
  clicks.forEach(c => {
    const day = new Date(c.timestamp).toLocaleDateString('en-IN', { day:'2-digit', month:'short' });
    map[day] = (map[day] || 0) + 1;
  });
  const labels = Object.keys(map).slice(-14); // last 14 days
  return { labels, data: labels.map(l => map[l]) };
}

function aggregateBy(clicks, field) {
  const map = {};
  clicks.forEach(c => {
    const key = c[field] || 'Unknown';
    map[key] = (map[key] || 0) + 1;
  });
  return { labels: Object.keys(map), data: Object.values(map) };
}

module.exports = router;
