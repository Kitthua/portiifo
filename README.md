# Shadrack Ngunguu — Portfolio

Full-stack portfolio site (HTML/CSS/JS frontend + Node.js Express backend) with working email contact form.

## Quick start (Frontend Only)

1. Open `index.html` in your browser (double-click).

## Setup with Email Backend

1. **Install Node.js** (if not already installed) — https://nodejs.org/

2. **Copy `.env.example` to `.env`** and fill in your Gmail credentials:
   ```bash
   cp .env.example .env
   ```
   - Get your Gmail app password: https://myaccount.google.com/apppasswords
   - Paste it into `.env` as `EMAIL_PASS`

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the server**:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:3000`

5. **Test**: Open `http://localhost:3000` in your browser and use the contact form.

## Contact

- WhatsApp: +254 70 596 1358 (https://wa.me/254705961358)
- Email: shadrackithua74@gmail.com

## Files

- `index.html`, `styles.css`, `script.js` — Frontend
- `server.js` — Express backend (handles POST to `/api/contact`)
- `package.json` — Dependencies
- `.env.example` — Environment template

## Deployment

Ready to deploy? I can help with GitHub Pages (frontend) + Heroku/Railway (backend) — let me know!
