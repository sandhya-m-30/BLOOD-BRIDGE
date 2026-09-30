# BloodBridge — Lifeline Network 🩸
> "Give Blood. Give Hope. Connect with available blood donors in your area."

BloodBridge is a high-speed, client-side blood donor registration and emergency blood search platform built with pure **HTML5, CSS3, and Vanilla JavaScript**.

---

## 🚀 Features

- **No Customer Accounts or Logins**: Voluntary donors register directly in seconds; blood seekers search immediately without login barriers.
- **Emergency Blood Finder**: Filter available donors by Blood Group ($A+, A-, B+, B-, AB+, AB-, O+, O-$), State, District, and City.
- **Direct Phone Dialing**: One-click **[ CALL DONOR ]** initiates direct telephone contact with willing voluntary donors.
- **3-Month Medical Cooldown Calculation**: Automatically calculates the 3-month waiting interval from the last donation date to ensure donor safety.
- **Cryptographic Admin Portal**: Restricted administrator panel protected with client-side SHA-256 hash authentication (no plaintext passwords in repository).
- **Interactive Pure CSS Analytics**: Visual inventory distribution by blood group, state breakdown, and match conversion rates.
- **Data Export & Backup**: Export and import donor rosters as CSV spreadsheets or full JSON backup archives.
- **Google Sheets Real-Time Cloud Sync**: Connect a free Google Apps Script Web App to sync donors across all mobile devices and computers in real-time.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic markup, accessible labels, inline vector SVGs.
- **CSS3**: Mobile-first design, dark charcoal & crimson glassmorphism theme, pure CSS bar charts.
- **Vanilla JavaScript**: ES6+, Web Crypto API (SHA-256), LocalStorage database with cloud sync.
- **Zero External Dependencies**: No Node.js, no React/Vue, no Bootstrap, no CDN libraries.

---

## 💻 Running Locally

Simply double-click `index.html` in your file explorer, or open it in any web browser (Chrome, Edge, Firefox, Safari). No web server required!

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Under **Branch**, select `main` and root `/`.
4. Click **Save**.
5. Your live site will be published at: `https://<your-username>.github.io/<repo-name>/`

---

## ⚠️ Medical & Architectural Notice

- **Medical Notice**: BloodBridge is a community donor connection platform and is not a hospital, blood bank, or medical facility. Always verify blood compatibility and eligibility with licensed medical practitioners and blood banks prior to donation.
- **Architecture**: In offline mode, data is saved locally in browser `localStorage`. Connect a Google Apps Script Web App URL in the Admin Data tab for multi-user real-time synchronization.
