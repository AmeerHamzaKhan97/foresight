# Technical Approach & User Stories

## Technical Approach Strategy

### 1. Monorepo Structure
We will use a unified MERN codebase to simplify development and deployment for the MVP.
- `root/`: `package.json`, generic configs.
- `client/`: React (Vite), Tailwind, Shadcn/UI.
- `server/`: Express API, Worker Processes (BullMQ).

### 2. Ingestion Pipeline (The "Hard" Part)
Since we are avoiding the official Twitter API due to costs/limits, we will use a browser-emulation based scraper (`agent-twitter-client` or Puppeteer-based custom solution).
- **Rate Limiting**: Critical. We must implement a token bucket or queue delay mechanism to avoid getting the scraper IP banned.
- **Failover**: If scraping fails, the job should retry with exponential backoff, eventually marking the creator as `ERROR` if unrecoverable.

### 3. AI Signal Extraction
- **Model**: Gemini Flash (Google AI Studio) via `google-generative-ai` SDK.
- **Prompt Engineering**: We need robust prompts that output strictly valid JSON. We will use Gemini's "Response Schema" feature if available or strict JSON mode prompts.
- **Cost Control**: Token usage monitoring. We process tweets in batches (e.g., 20 tweets per prompt) to save context window overhead.

### 4. Job Queue (BullMQ)
- **Redis**: Required. We will use a cloud Redis (e.g., Upstash free tier) or local Redis for dev.
- **Flow**: `API -> Add Job -> Redis -> Worker -> DB`.

---

## User Stories

### Epic 1: Creator Discovery & Ingestion
| ID | Story | Tech Notes |
|----|-------|------------|
| **US-1.1** | As a user, I want to search for a creator by handle so I can see if they are already analyzed. | API `GET /creators?q=`. Index `handle` field. |
| **US-1.2** | As a user, I want to submit a new creator profile URL for analysis if they don't exist. | API `POST /creators`. Validates URL regex. Enqueues `validate-creator` job. Returns "Pending" status. |
| **US-1.3** | As a system, I need to validate a submitted Twitter profile exists and is public. | Worker `validate-creator`. Scraper visits profile. If 404/Private, fail job. |
| **US-1.4** | As a system, I need to fetch the last 100 tweets of a validated creator. | Worker `fetch-content`. Scraper scrolls/paginates. Saves raw text to `Content` collection. |

### Epic 2: AI Signal Analysis
| ID | Story | Tech Notes |
|----|-------|------------|
| **US-2.1** | As a system, I want to extract "Affiliations" mentioned in tweets. | AI Job. Prompt: "List entities & sentiment". Store in `Signal` collection (`type: affiliation`). |
| **US-2.2** | As a system, I want to extract "Claims" and "Evidence" availability. | AI Job. Prompt: "Is this a claim? Is evidence provided?". Store `Signal` (`type: credibility`). |
| **US-2.3** | As a system, I want to prevent re-analyzing the same tweets to save costs. | Check `Content` collection `analyzed: true` flag before enqueuing AI jobs. |

### Epic 3: Aggregation & Scoring
| ID | Story | Tech Notes |
|----|-------|------------|
| **US-3.1** | As a system, I want to aggregate individual signals into a Creator-level "Affiliation Score". | Aggregation Job. Group `Signal` by entity. Sum weighted sentiment. Update `Creator.affiliationScore`. |
| **US-3.2** | As a system, I want to calculate a "Credibility Score" based on evidence/claims ratio. | Aggregation Job. Formula: `(EvidenceProvided / TotalClaims) * Weight`. |

### Epic 4: User Interface (Dashboard)
| ID | Story | Tech Notes |
|----|-------|------------|
| **US-4.1** | As a user, I want to see a Dashboard with the Creator's overall scores. | Component `ScoreCard`. Fetches `Creator` model. Values: 0-100 color coded. |
| **US-4.2** | As a user, I want to see an "Affiliation Map" (who they support/oppose). | Component `AffiliationList`. List entities sorted by alignment strength. |
| **US-4.3** | As a user, I want to see "Flagged Posts" explaining *why* a score is low. | Component `FlaggedContent`. Dispalys Tweet Text + AI Reasoning. |
| **US-4.4** | As a user, I want to see a timeline of how their stance changed (Optional MVP). | Chart (Recharts). X=Time, Y=Sentiment. |

### Epic 5: Infrastructure & Devex
| ID | Story | Tech Notes |
|----|-------|------------|
| **US-5.1** | As a developer, I want a Docker compose file to run Redis/Mongo locally. | `docker-compose.yml`. |
| **US-5.2** | As a developer, I want a script to seed the DB with sample data for UI testing. | `scripts/seed.js`. |
