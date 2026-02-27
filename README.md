<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel" alt="Vercel" />
</p>

<h1 align="center">Enterprise Banking Intelligence Command Centre</h1>

<p align="center">
  <strong>A cinematic, executive-grade command centre for Banking & Financial Services</strong><br/>
  Real-time visibility into <em>risk</em>, <em>growth</em>, <em>liquidity</em>, and <em>customer health</em>
</p>

<p align="center">
  <sub>Inspired by Bloomberg Terminal × Palantir × Modern Digital Banking Platforms</sub>
</p>

---

## ✨ Overview

This is a **consulting-grade demo application** designed to excite banking stakeholders and accelerate data & AI transformation engagements. It is **not a dashboard** — it is how banking leadership sees risk before it materializes, detects growth opportunities early, and aligns finance, risk, and business teams.

---

## 🎯 Target Users

| Role | Focus |
|------|-------|
| **Chief Risk Officer (CRO)** | Credit risk, NPA, fraud, compliance |
| **Chief Financial Officer (CFO)** | Liquidity, ALM, treasury, stress scenarios |
| **Chief Digital Officer (CDO)** | Customer health, growth, branch performance |
| **Retail & Corporate Banking Heads** | Portfolio view, peer benchmarks, early warning |

---

## 🚀 Key Capabilities

- **Executive KPI Bar** — Animated counters with real-time metrics
- **Credit Risk & NPA Intelligence** — Geographic and sector-level risk mapping
- **Liquidity & ALM Monitoring** — LCR gauges, CASA trends, funding gaps
- **Customer Profitability & Churn Radar** — Segment health visualization
- **Fraud & Anomaly Detection** — Timeline and severity tracking
- **AI-Generated Executive Insights** — Contextual recommendations
- **AI Chat** — Chat with OpenAI about your dashboard data (bring your own API key)
- **Stress Scenario Simulator** — What-if analysis
- **Peer Benchmark Overlay** — Competitive positioning
- **Meeting Mode & Executive Summary** — Presentation-ready views

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Charts | Recharts |
| Data | Server-side mock generator |

---

## 📦 Quick Start

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 9+

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-org/banking-command-centre.git
cd banking-command-centre

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker

### Build & Run

```bash
# Build the image
docker build -t banking-command-centre .

# Run the container
docker run -p 3000:3000 banking-command-centre
```

### Docker Compose

```bash
# Start with one command
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

The app will be available at [http://localhost:3000](http://localhost:3000).

> **Note:** If port 3000 is in use (e.g. by `npm run dev`), change the port in `docker-compose.yml` to `"8080:3000"` or stop the dev server first.

### Production Notes

- Multi-stage build for minimal image size (~180MB)
- Runs as non-root user (`nextjs`)
- Health check enabled for orchestration
- Uses Next.js standalone output for optimized deployment

---

## ▲ Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/banking-command-centre)

### Manual Deployment

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts to link your project or create a new one.

3. **Production deployment**
   ```bash
   vercel --prod
   ```

### Git Integration

Connect your GitHub/GitLab/Bitbucket repository to Vercel for automatic deployments:

- **Preview** — Every push to a branch gets a unique URL
- **Production** — Pushes to `main` deploy to your production domain

### Configuration

- `vercel.json` includes security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- Next.js is auto-detected; no additional config required
- Environment variables can be set in the Vercel dashboard

---

## 📁 Project Structure

```
banking-command-centre/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (metrics)
│   ├── layout.tsx
│   └── page.tsx
├── components/            # React components
│   ├── dashboard/        # Chart & panel components
│   └── ...
├── contexts/              # React contexts (theme, toast)
├── lib/                   # Utilities, mock data, thresholds
├── public/                # Static assets
├── Dockerfile             # Production Docker image
├── docker-compose.yml     # Docker Compose config
├── vercel.json            # Vercel deployment config
└── package.json
```

---

## 🤖 AI Chat

The dashboard includes an **AI Chat** panel that lets you ask questions about your dashboard data using OpenAI. Users must add their own OpenAI API key:

1. Click the **chat icon** in the header
2. Click **Add OpenAI API Key** and enter your key from [platform.openai.com](https://platform.openai.com/api-keys)
3. Your key is stored locally in your browser and never sent to our servers
4. Start chatting—the AI has access to your dashboard data (KPIs, credit risk, liquidity, customer data, fraud signals, etc.)

You can ask questions like "Summarise our key risk areas", "What's driving NPA in our portfolio?", or "Liquidity position and recommendations".

---

## 🧪 Data

All data is **realistic mock enterprise data** generated on the server. No real customer or financial data is used. The mock generator produces:

- KPIs, credit risk metrics, liquidity ratios
- Customer segments, fraud events, growth indicators
- Peer benchmarks, stress scenarios, filing calendar

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## ⚠️ Disclaimer

This application is for **demonstration and consulting purposes only**. It is not intended for production banking usage. Do not use with real customer or financial data.

---

## 📄 License

Private / Proprietary — All rights reserved.

---

<p align="center">
  <sub>Built for banking leadership. Designed for impact.</sub>
</p>
