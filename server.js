require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const session    = require('express-session');
const passport   = require('passport');
const flash      = require('connect-flash');
const path       = require('path');

const app = express();

// ── DB ────────────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅  MongoDB connected'))
  .catch(err => console.error('❌  MongoDB error:', err));

// ── PASSPORT CONFIG ───────────────────────────────────────────────────────────
require('./middleware/passport')(passport);

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global locals for views
app.use((req, res, next) => {
  res.locals.user          = req.user || null;
  res.locals.success_msg   = req.flash('success');
  res.locals.error_msg     = req.flash('error');
  next();
});

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/',       require('./routes/index'));
app.use('/auth',   require('./routes/auth'));
app.use('/url',    require('./routes/url'));

// ── START ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀  Server running → http://localhost:${PORT}`);
});
