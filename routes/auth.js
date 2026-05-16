const express  = require('express');
const router   = express.Router();
const passport = require('passport');
const User     = require('../models/User');
const { ensureGuest } = require('../middleware/auth');

// ── REGISTER ──────────────────────────────────────────────────────────────────
router.get('/register', ensureGuest, (req, res) => res.render('register'));

router.post('/register', ensureGuest, async (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  if (!name || !email || !password) errors.push('All fields are required.');
  if (password !== password2)       errors.push('Passwords do not match.');
  if (password && password.length < 6) errors.push('Password must be at least 6 characters.');

  if (errors.length > 0) return res.render('register', { errors, name, email });

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      errors.push('Email already registered.');
      return res.render('register', { errors, name, email });
    }
    const user = new User({ name, email, password });
    await user.save();
    req.flash('success', 'Account created! Please log in.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.render('register', { errors: ['Server error. Try again.'] });
  }
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
router.get('/login', ensureGuest, (req, res) => res.render('login'));

router.post('/login', ensureGuest, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })(req, res, next);
});

// ── LOGOUT ────────────────────────────────────────────────────────────────────
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success', 'Logged out successfully.');
    res.redirect('/auth/login');
  });
});

module.exports = router;
