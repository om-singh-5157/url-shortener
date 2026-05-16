const express = require('express');
const router  = express.Router();
const UAParser = require('ua-parser-js');
const URL     = require('../models/URL');

// Home page
router.get('/', (req, res) => {
  res.render('home');
});

// Dashboard
router.get('/dashboard', require('../middleware/auth').ensureAuth, async (req, res) => {
  try {
    const urls = await URL.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.render('dashboard', { urls, baseUrl: process.env.BASE_URL || 'http://localhost:3000' });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// ── SHORT URL REDIRECT ────────────────────────────────────────────────────────
router.get('/:code', async (req, res) => {
  try {
    const urlDoc = await URL.findOne({
      $or: [{ shortCode: req.params.code }, { customAlias: req.params.code }],
      isActive: true
    });

    if (!urlDoc) return res.status(404).render('404');

    // Check expiry
    if (urlDoc.expiresAt && new Date() > urlDoc.expiresAt) {
      urlDoc.isActive = false;
      await urlDoc.save();
      return res.status(410).render('expired');
    }

    // Parse user agent for analytics
    const parser  = new UAParser(req.headers['user-agent']);
    const ua      = parser.getResult();
    const click   = {
      browser:  ua.browser.name  || 'Unknown',
      os:       ua.os.name       || 'Unknown',
      device:   ua.device.type   ? 'Mobile' : 'Desktop',
      referrer: req.headers.referer || 'Direct',
    };

    urlDoc.clicks.push(click);
    await urlDoc.save();

    return res.redirect(urlDoc.originalUrl);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;
