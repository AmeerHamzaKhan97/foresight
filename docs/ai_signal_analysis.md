]# AI Signal Analysis Setup: Tasks 9-13 (User Story 2)

## Scope
This document details the implementation steps for the AI Analysis pipeline using Gemini/OpenRouter to extract affiliation and credibility signals from tweets.

---

## Task 9: Environment & Models Setup
**Objective**: Prepare the database and environment for AI processing.

### Detailed Steps
1.  **AI Config**: Add `GEMINI_API_KEY` to `.env`. Create `server/src/config/ai.ts` to initialize the Google Generative AI SDK.
2.  **Content Schema (`Content.js`)**:
    - `creatorId`: ObjectId (Ref: Creator).
    - `platformId`: String (Tweet ID).
    - `text`: String.
    - `metadata`: Object (retweets, likes).
    - `analyzed`: Boolean (Default: false).
3.  **Signal Schema (`Signal.js`)**:
    - `contentIds`: Array of ObjectIds (Ref: Content).
    - `creatorId`: ObjectId (Ref: Creator).
    - `type`: Enum (`affiliation`, `credibility`, `incentive`).
    - `data`: Mixed (JSON extraction result).
    - `reasoning`: String (Explainability text).

### Future Impact Questions
> [!QUESTION] **Cost Optimization**
> Should we batch analysis (e.g., 20 tweets per prompt) or process one-by-one?
> *Recommendation*: Batching is significantly cheaper and faster, but requires careful prompt engineering to avoid context loss.

---

## Task 10: AI Service Layer & Prompting
**Objective**: Build reliable prompts that return structured JSON.

### Detailed Steps
1.  **Gemini Utility**: Implement `server/src/services/ai/gemini.ts`. Use Schema Enforcement (Response Schema) to ensure valid JSON.
2.  **Affiliation Prompt**:
    - Focus: Identify specific brands, politicians, ideologies.
    - Output: `{ "entities": [{ "name": "X", "sentiment": "+/-", "strength": "1-5" }], "reasoning": "..." }`.
3.  **Credibility Prompt**:
    - Focus: Verifiability, Evidence mentioned, Language confidence.
    - Output: `{ "claims": [{ "text": "...", "verifiable": true, "hasEvidence": false }], "overallConfidence": "..." }`.

---

## Task 11: Signal Extraction Logic
**Objective**: Orchestrate the flow of data through AI.

### Detailed Steps
1.  **Deduplication (US-2.3)**: Implement `Extractor.getUnanalyzedContent(creatorId)`. Filter out anything where `analyzed: true`.
2.  **Batching Logic**: Split unanalyzed tweets into groups of N.
3.  **Update Logic**: After a successful AI call, update all processed `Content` items to `analyzed: true`.

---

## Task 12: AI Pipeline Background Workers
**Objective**: Ensure AI processing doesn't block the API.

### Detailed Steps
1.  **Worker Implementation**: `server/src/workers/signalWorker.ts`.
2.  **Job Flow**:
    - User adds creator -> `validate-creator` job.
    - Validation success -> `fetch-content` job (Task 5).
    - Fetch success -> Enqueue `extract-signals` job.
3.  **Error Handling**: Retry jobs with exponential backoff for AI rate limits (429s).

---

## Task 13: API & Frontend Integration
**Objective**: Display signals to the user.

### Detailed Steps
1.  **Endpoint**: `GET /api/creators/:handle/signals`. Returns grouped signals.
2.  **Components**:
    - `SignalCard`: A visual card showing the reasoning and related tweets.
    - `ExplanatoryBadge`: Color-coded indicators for alignment/credibility.
3.  **Real-time Feedback**: Use the polling mechanism (Task 8) to show when "AI Analysis" is running.

---

## Questions That Impact Future Development

> [!CAUTION]
> **Prompt Brittleness**: AI models updated on the backend can sometimes change their JSON output format. Should we implement a "Strict Schema Validator" (like Zod) to check AI responses before saving?
> *Impact*: Prevents frontend crashes but might lead to more failed jobs.

> [!QUESTION] **Signal Grouping**
> If a creator mentions "OpenAI" in 10 separate tweets, should the UI show 10 signal cards or 1 summary card?
> *Recommendation*: Grouping by Entity (Affiliation) and Category (Credibility) creates a cleaner Dashboard.

---

## Next Steps
Once these tasks are complete, the system will actually "think" and provide insights beyond just raw tweets.

**Proceed to Epic 3: Aggregation & Scoring (The final math).**
