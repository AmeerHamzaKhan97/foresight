# Technical Design Document: Foresight
## 1. Introduction
This document outlines the technical architecture for the Foresight, a platform designed to analyze creator content on Twitter/X for affiliation and credibility signals.

**Tech Stack**: MERN (MongoDB, Express, React, Node.js)
**Context**: MVP Scope (Twitter Only)

## 2. System Architecture

### 2.1 High-Level Overview
The system consists of a User-Facing Web Application (React), a REST API (Express), a Database (MongoDB), and an Asynchronous Worker System for processing heavy ingestion and AI extraction tasks.

```mermaid
graph TD
    User[User Client] -->|HTTPS| CDN[CDN/Load Balancer]
    CDN --> Frontend[React SPA]
    Frontend -->|API Calls| API[Express API Server]
    
    subgraph Backend
        API -->|Read/Write| DB[(MongoDB)]
        API -->|Enqueue Jobs| Queue[Job Queue (Redis/BullMQ)]
        
        Queue --> Worker[Worker Service]
        Worker -->|Fetch Data| Twitter[Twitter/X API]
        Worker -->|Extract Signals| LLM[AI Provider (e.g. OpenAI/Anthropic)]
        Worker -->|Store Results| DB
    end
```

## 3. Ambiguities & Open Questions (Resolved)
> [!NOTE]
> Decisions based on user feedback.

1.  **AI Provider**: **Gemini / OpenRouter**. 
    *   *Decision*: Use Gemini (via Google AI Studio) or OpenRouter (free/low-cost models) to minimize budget.
2.  **Twitter Data Access**: **Scraper / Third-party**.
    *   *Decision*: To maintain minimum budget (avoiding $100/mo API), we will use a scraper-based approach (likely `agent-twitter-client` or similar) with appropriate rate limiting and error handling. *Risk: Stability.*
3.  **User Authentication**: **Public**.
    *   *Decision*: No user login required for MVP. All features public.
4.  **Job Queue Infrastructure**: **BullMQ**.
    *   *Decision*: BullMQ (Redis-backed). Lightweight and standard for Node/Express.

## 4. Data Models (MongoDB)

### 4.1 Creator
```json
{
  "_id": "ObjectId",
  "handle": "String (Unique, Indexed)",
  "platform": "String (Enum: 'twitter')",
  "status": "String (Enum: 'PENDING', 'ACTIVE', 'ERROR')",
  "displayName": "String",
  "profileImage": "String",
  "metadata": {
    "followersCount": "Number",
    "description": "String"
  },
  "lastIngestedAt": "Date",
  "affiliationScore": "Number", // Cached aggregate
  "credibilityScore": "Number"  // Cached aggregate
}
```

### 4.2 Content (Tweet)
```json
{
  "_id": "ObjectId",
  "creatorId": "ObjectId (Ref: Creator)",
  "platformId": "String (Tweet ID)",
  "text": "String",
  "type": "String (Enum: 'tweet', 'reply', 'thread')",
  "publishedAt": "Date (Indexed)",
  "metrics": {
    "likes": "Number",
    "retweets": "Number"
  },
  "ingestedAt": "Date"
}
```

### 4.3 Signal (AI Extraction Result)
```json
{
  "_id": "ObjectId",
  "contentId": "ObjectId (Ref: Content)",
  "creatorId": "ObjectId (Ref: Creator)",
  "type": "String (Enum: 'affiliation', 'claim', 'incentive', 'consistency')",
  "version": "String (Schema Version)",
  "data": {
    // Dynamic schema based on type.
    // E.g. for Affiliation:
    "entities": [
        { "name": "Bernie Sanders", "sentiment": "positive", "alignment": "high" }
    ]
  },
  "reasoning": "String (Markdown)", // Explainability
  "createdAt": "Date"
}
```

## 5. API Design

### 5.1 Creator Endpoints
*   `GET /api/creators?query=...` - Search creators.
*   `POST /api/creators` - Add new creator (triggers validation job).
    *   Body: `{ "url": "https://x.com/username" }`
*   `GET /api/creators/:handle` - Get profile details & aggregate scores.
*   `GET /api/creators/:handle/timeline` - Get timeline data with signals.
*   `GET /api/creators/:handle/signals` - Detailed signals/flagged posts.

## 6. Background Workers (Ingestion Pipeline)

### Queue: `ingestion-queue`
1.  **Job: `validate-creator`**
    *   Input: `profileUrl`
    *   Action: Check existence. If valid, create `Creator` doc (Status: PENDING), trigger `fetch-content`.
2.  **Job: `fetch-content`**
    *   Input: `creatorId`
    *   Action: Fetch last N tweets. Save `Content`. Trigger `extract-signal` for each content item.
3.  **Job: `extract-signal`**
    *   Input: `contentId`, `signalType` (Parallel jobs for Affiliation, Claim, etc.)
    *   Action: Call LLM with predefined prompt. Save `Signal`.
4.  **Job: `aggregate-signals`**
    *   Input: `creatorId`
    *   Action: Triggered after batch extraction or periodically. Re-calculate scores.

## 7. Frontend Architecture (React)
*   **Routing**: React Router
*   **State**: React Query (TanStack Query) for API caching.
*   **UI Library**: Tailwind CSS + Shadcn/UI (Clean, professional).
*   **Visualization**: Recharts (for timeline/score charts) or specialized graph lib for Affiliation Map.

