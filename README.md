# 🚀 Money💲 — Next-Gen AI-Powered Glassmorphic Finance Platform

Money💲 is a futuristic, next-generation AI-powered personal finance management platform designed for modern users. With a stunning glassmorphic visual makeover, smooth CSS animations, and instant AI receipt scanning, Money💲 helps you track, analyze, and automate your wealth with zero friction.

---

## 🎨 Futuristic Design Overhaul (Makeover V2)
- **Glassmorphism Design System**: Semi-transparent panels with backdrop filters, translucent borders, and deep floating gradient backdrops.
- **Micro-Animations & Neon Glows**: Interactive hover scaling, pulsing neon light bars, linear cashflow gradients, and scrolling futuristic grid overlays.
- **AI Scanning HUD Overlay**: Dotted interactive dropzone containing a dynamic laser scan animation overlay while parsing documents.
- **Responsive Navigation Capsule**: A floating, rounded navigation bar with glassmorphism that overlays dashboard and landing pages.

---

## 🔮 Advanced Financial Features & Global HUD Loader (Makeover V3)
- **Global Ticker Loader**: A frosted glassmorphic loader modal that shows rotating double visual rings, neon glowing bars, and cycling financial log phrases to indicate interaction feedback.
- **Dynamic Tabbed Navigation**: A futuristic selector on the dashboard allowing seamless switching between:
  1. **Command Center**: Budgets overview, recent activity pie charts, and multiple wallet drawer integrations.
  2. **Savings Goals**: Savings cards featuring circular SVG progress rings, deposit/withdrawal modifiers, and fully-funded badges.
  3. **Subscription Manager**: Recurring service manager computing monthly burn rates, billing cycles, and next-renewal alerts.
  4. **Wealth & Health Diagnostics**: Assets vs. custom liabilities net worth AreaChart and a Financial Health Score gauge showing diagnostics and sub-scores.
  5. **Calculators & Data Exports**:
     - *Cashflow Heatmap*: Grid showing daily cash changes and counts.
     - *Expense Forecasting*: Projections bar chart using historical trends.
     - *Debt payoff*: Snowball vs. Avalanche simulator.
     - *Currency Converter*: Simulated rate desk for USD, EUR, GBP, JPY, and INR.
     - *Ledger Exporter*: Instantly download filtered transaction data to CSV/JSON files.


---

## 🔧 Tech Stack

| Category           | Tools / Frameworks                                     |
| ------------------ | ------------------------------------------------------ |
| Frontend           | Next.js 15, React 19, Tailwind CSS, Shadcn UI          |
| Backend            | Node.js, SQLite (Local Dev) / PostgreSQL (Prod), Prisma|
| Authentication     | Clerk (Standard Mode) & Guest Session fallback mode    |
| Forms & Validation | React Hook Form, Zod                                   |
| AI Integrations    | Gemini API (`gemini-flash-latest` model)               |
| Email Service      | Resend                                                 |
| Background Jobs    | Inngest, Cron Jobs                                     |
| Data Visualization | Recharts with neon glows and linear gradients          |
| Security           | Arcjet (Rate Limiting, Bot Protection)                 |

---

## 📂 Project Structure

```bash
/
├── actions/               # Next.js Server Actions (Transactions, Accounts, AI Scanner)
├── app/                   # Next.js 15 App Directory (Layouts, routes, global styles)
├── components/            # Reusable React components (Floating Nav, Hero, Chatbot)
├── data/                  # Static landing contents and categories data
├── emails/                # Resend Email templates
├── hooks/                 # React state utility hooks
├── lib/                   # Database, guest session, and auth utilities
├── prisma/                # Prisma schema (SQLite dev.db target) and local migrations
├── public/                # Static assets and screenshots
```

---

## 🚀 Getting Started

### 1. Install Dependencies
Run the installation command to fetch all packages:
```bash
npm install --legacy-peer-deps
```

### 2. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=AIzaSyDR_NdlD_W1WLAmitqtBxXbIHCn8aHtjQs
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
# CLERK_SECRET_KEY=
# NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
# NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
# NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
# NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
# RESEND_API_KEY=
# ARCJET_KEY=
```
*Note: Clerk authentication can be bypassed by choosing **Try as Guest** on the homepage, allowing you to experience the full app with automatically seeded dummy data.*

### 3. Initialize the SQLite Local Database
Compile the Prisma schema and set up the local `dev.db` database file:
```bash
npx prisma migrate dev --name init
```

### 4. Run the Development Server
Launch the local Next.js application:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser to experience the futuristic money terminal!

---

## 🛡️ Security & Validations
* Rate limiting and bot shielding powered by **Arcjet**
* Type-safe inputs and schemas compiled using **Zod** and **React Hook Form**
* Full Clerk auth encryption with persistent guest cookies fallback
