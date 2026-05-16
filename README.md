# SnapLink — URL Shortener with Analytics

A full-stack URL shortening service with click analytics, built with Node.js, Express, MongoDB, and EJS.

## 🚀 Features
- 🔗 Shorten any URL with a 6-character code
- 🎯 Custom aliases (e.g. `snaplink/my-brand`)
- ⏰ Link expiry (1, 7, 30 days or never)
- 📊 Analytics dashboard — clicks by browser, OS, device, time
- 🔒 JWT-based auth with bcrypt password hashing
- 👤 User accounts — each user manages their own links
- ⏸ Activate/deactivate links without deleting
- 📋 One-click copy to clipboard

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | Passport.js (Local Strategy) + bcrypt |
| Views | EJS templating |
| Charts | Chart.js |
| UA Parsing | ua-parser-js |
| Deploy | Render |

## 📁 Project Structure
```
url-shortener/
├── server.js              ← Entry point
├── models/
│   ├── User.js            ← User schema
│   └── URL.js             ← URL + clicks schema
├── routes/
│   ├── index.js           ← Home, dashboard, redirect
│   ├── auth.js            ← Register, login, logout
│   └── url.js             ← Shorten, analytics, delete
├── middleware/
│   ├── passport.js        ← Auth strategy
│   └── auth.js            ← Route guards
├── views/
│   ├── home.ejs
│   ├── dashboard.ejs
│   ├── analytics.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── partials/
└── public/
    ├── css/style.css
    └── js/main.js
```

## ⚙️ Setup & Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/om-singh-5157/url-shortener.git
cd url-shortener
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and session secret
```

### 4. Get MongoDB URI
- Go to [MongoDB Atlas](https://cloud.mongodb.com)
- Create a free cluster → Connect → Get connection string
- Paste into `MONGO_URI` in your `.env`

### 5. Run the app
```bash
npm run dev     # development (with nodemon)
npm start       # production
```

### 6. Open in browser
```
http://localhost:3000
```

## 🌐 Deploy on Render (Free)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set environment variables (MONGO_URI, SESSION_SECRET, BASE_URL, PORT)
5. Deploy!

## 👨‍💻 Author
**Om Singh** — [LinkedIn](https://linkedin.com/in/om-singh-5157-cvrgu) · [GitHub](https://github.com/om-singh-5157)
