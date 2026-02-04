# Foresight: Creator Affiliation & Credibility Analyzer

![Status: MVP](https://img.shields.io/badge/Status-MVP-orange)
![License: ISC](https://img.shields.io/badge/License-ISC-blue)

**Foresight** is a powerful MERN-stack platform that analyzes public creator content (starting with Twitter/X) to extract affiliation signals and credibility indicators. Using advanced AI (Gemini), it aggregates these signals over time to provide explainable trust insights.

> **Note**: The system does not decide who is trustworthy. It reveals patterns so users can decide for themselves.

---

## 🚀 Live Demo
[**View the Live Demo on GitHub Pages**](https://AmeerHamzaKhan97.github.io/foresight/)
*(Note: The demo uses mock data to showcase the UI and analysis patterns.)*

### 🔍 Try searching for:
- **Amitabh Bachchan** (`SrBachchan`)
- **Arun Maini** (`mrwhosetheboss`)
- **Bill Gates** (`BillGates`)
- **Jr NTR** (`tarak9999`)
- **Veritasium** (`veritasium`)

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

### 1. Push Code to GitHub

If you haven't already, link this project to your GitHub repository:

```ps1
# Add your remote repository (Replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push the code
git branch -M master
git push -u origin master
```

### 2. Local Setup

1. **Install dependencies**:
   ```ps1
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the root and add:
   ```env
   MONGODB_URI=your_mongodb_uri
   REDIS_URL=redis://localhost:6379
   GEMINI_API_KEY=your_gemini_key
   ```

3. **Running the Application**:
   ```ps1
   npm run dev
   ```

---

## 🚀 Live Demo (GitHub Pages)

The project is configured to automatically use **mock data** when hosted on GitHub Pages (detected via `github.io` hostname).

### How to Deploy:

1. **Install deployment tool**:
   ```ps1
   cd client
   npm install
   ```

2. **Deploy the frontend**:
   ```ps1
   npm run deploy
   ```
   *This will build the React app and push it to the `gh-pages` branch.*

3. **Update Demo Link**:
   Once deployed, replace `YOUR_GITHUB_PAGES_URL_HERE` at the top of this file with your actual URL (usually `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`).

---

## 📜 License

This project is licensed under the **ISC License**.
