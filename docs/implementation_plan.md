# Implementation Plan - Foresight (CAC Analyzer) MVP

## Goal Description
Build "Foresight", a platform to analyze creator content on Twitter/X for affiliation and credibility signals. The system will use a MERN stack, BullMQ for async job processing, and Gemini/OpenRouter for AI signal extraction.

## User Review Required
> [!WARNING]
> **Twitter Scraping Risk**: We are using a scraper-based approach (`agent-twitter-client` or similar) to avoid API costs. This method can be fragile and subject to breaking changes from Twitter.
> **AI Costs**: We are targeting free tier models (Gemini Flash), but verify rate limits and usage policies.

## Proposed Changes

### Setup & Infrastructure
#### [NEW] `package.json`
- Initialize MERN monorepo or standard structure (client/server).
- Dependencies: `express`, `mongoose`, `bullmq`, `openai` (or gemini lib), `agent-twitter-client`.

### Backend (Server)
#### [NEW] `server/models`
- `Creator.js`: Schema for creator profiles.
- `Content.js`: Schema for tweets/replies.
- `Signal.js`: Schema for AI extracted insights.

#### [NEW] `server/routes`
- `api/creators`: POST (add), GET (search/details).

#### [NEW] `server/workers`
- `ingestionWorker.js`: BullMQ worker for `fetch-content` and `extract-signal` jobs.
- `scrapers/twitter.js`: Wrapper around twitter extraction logic.

### Frontend (Client)
#### [NEW] `client/src/pages`
- `Home.js`: Search bar and hero section.
- `CreatorProfile.js`: Detailed view with Signal Map and Credibility Score.

#### [NEW] `client/src/components`
- `AffiliationCard.js`, `CredibilityChart.js`.

## Verification Plan

### Automated Tests
- **Backend API Tests**: simple `jest` + `supertest` for API endpoints.
    - `npm run test:api`
- **Worker Tests**: Mocked unit tests for worker logic (mocking the scraper).

### Manual Verification
1.  **Ingestion Flow**:
    - Start server and worker (`npm run dev`).
    - POST a test twitter handle (e.g., `@veritasium`).
    - Verify logs show "Job Enqueued" -> "Scraping Success" -> "AI Extraction Success".
    - Check MongoDB for created documents.
2.  **UI Verification**:
    - Open `http://localhost:3000`.
    - Search for the ingested handle.
    - Verify profile page loads with Data.
