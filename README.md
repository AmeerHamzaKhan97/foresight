# Foresight: Creator Affiliation & Credibility Analyzer

![Status: MVP](https://img.shields.io/badge/Status-MVP-orange)
![License: ISC](https://img.shields.io/badge/License-ISC-blue)

**Foresight** is a powerful MERN-stack platform that analyzes public creator content (starting with Twitter/X) to extract affiliation signals and credibility indicators. Using advanced AI (Gemini), it aggregates these signals over time to provide explainable trust insights.

> **Note**: The system does not decide who is trustworthy. It reveals patterns so users can decide for themselves.

---

## 🚀 Live Demo
[**View the Live Demo on GitHub Pages**](YOUR_GITHUB_PAGES_URL_HERE)
*(Note: The demo uses mock data to showcase the UI and analysis patterns.)*

---

## ✨ Key Features

- **🔍 Creator Discovery**: Search for creators by handle or add new profiles via URL.
- **🤖 AI Signal Extraction**: stateless, schema-driven analysis of posts for:
    - **Affiliations**: Brands, ideologies, and alignment strength.
    - **Credibility**: Evidence ratio, consistency, and incentive risks.
- **📊 Explainable Scoring**: Every score is traceable to specific posts and AI reasoning.
- **📈 Timeline Insights**: Track how a creator's alignment or credibility shifts over time.
- **⚡ Async Ingestion**: Robust background worker system (BullMQ) for fetching and processing data.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Recharts.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **AI Layer**: Google Gemini API via `@google/generative-ai`.
- **Infrastructure**: BullMQ (Redis-backed) for the ingestion pipeline.
- **Data Access**: `agent-twitter-client` for Twitter/X scraping.

---

## 📁 Project Structure

```text
foresight/
├── client/           # React Frontend (Vite)
├── server/           # Express Backend & Background Workers
├── docs/             # PRD, Technical Design, and Implementation Plans
└── README.md         # You are here
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js**: v18+ 
- **MongoDB**: Local or Atlas instance.
- **Redis**: Required for BullMQ (background jobs).

### Installation

1. **Clone the repository**:
   ```ps1
   git clone <your-repo-url>
   cd foresight
   ```

2. **Install dependencies**:
   ```ps1
   npm install
   # This will install dependencies for both client and server via workspaces
   ```

3. **Environment Setup**:
   Create a `.env` file in the root (or `server/`) and add:
   ```env
   MONGODB_URI=your_mongodb_uri
   REDIS_URL=redis://localhost:6379
   GEMINI_API_KEY=your_gemini_key
   ```

4. **Running the Application**:
   ```ps1
   npm run dev
   ```

---

## 📝 Deployment to GitHub Pages (Demo)

To deploy the frontend to GitHub Pages:

1. Update the `base` property in `client/vite.config.ts` if your repo is not at the root.
2. Build the project: `npm run build` --workspace=client.
3. Use the `gh-pages` package or manually push the `dist` folder to the `gh-pages` branch.

---

## 📜 License

This project is licensed under the **ISC License**.
