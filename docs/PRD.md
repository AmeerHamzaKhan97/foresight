# Product Requirements Document (PRD)

## Product Name (Working)

Foresight

---

## 1. Problem Statement

Users increasingly rely on online creators (Twitter/X, Instagram, YouTube, etc.) for opinions, advice, and information. However:

* Creator **affiliations** (brands, ideologies, incentives) are often implicit or undisclosed
* **Credibility** is difficult to judge from isolated posts
* Existing tools focus on fact-checking or engagement metrics, not **trust patterns over time**

Users lack a systematic, explainable way to answer:

> “Who is this creator aligned with, and how trustworthy are they over time?”

---

## 2. Product Vision

Build a platform that analyzes public creator content to extract **affiliation signals** and **credibility signals**, aggregates them over time, and presents **explainable trust insights** to users.

The product does NOT claim objective truth. It surfaces **patterns, signals, and indicators** to help users make informed judgments.

---

## 3. Target Users

### Primary Users

* Power social media users
* Journalists / researchers
* Investors / analysts (finance, crypto, macro)
* Policy / media watchdogs

### Secondary Users

* Brands performing influencer due diligence
* Platforms / moderation teams (future B2B)

---

## 4. Key User Questions (JTBD)

1. Who or what does this creator consistently support or oppose?
2. Are their opinions driven by incentives?
3. How often do they make strong claims without evidence?
4. Do they correct themselves when wrong?
5. Has their stance changed over time, and why?

---

## 5. MVP Scope (Strict)

### Platforms

* Twitter / X only

### Content Types

* Tweets
* Replies (optional toggle)
* Threads

### Time Range

* Last N tweets (configurable, default 1,000)

---

## 6. Functional Requirements

### 6.1 Creator Discovery & Registration

**FR-1**: User can search for a creator by handle or name

**FR-2**: If creator is not found, user can add creator by providing platform profile URL

**FR-3**: System validates:

* Profile existence
* Public accessibility
* Platform type

**FR-4**: Creator enters `PENDING` state until ingestion completes

---

### 6.2 Ingestion Jobs (Async)

#### Job 1: Creator Validation Job

* Verifies creator identity
* Stores metadata (handle, platform, follower count)
* Transitions creator to `ACTIVE`

#### Job 2: Content Fetch Job (Platform-Specific)

* Fetches tweets, replies, threads
* Stores raw, immutable content
* Stores metadata (timestamp, likes, retweets)

Constraints:

* No AI processing in ingestion
* Idempotent and retry-safe

---

### 6.3 Signal Extraction (AI Jobs)

Signal extraction jobs are **stateless**, **prompt-based**, and **schema-driven**.

Each job processes content independently and writes structured signals.

---

#### 6.3.1 Affiliation Signal Extractor

Per post:

* Entities mentioned (brand/person/ideology)
* Sentiment toward entity
* Alignment strength (low/medium/high)
* Explicit vs implicit
* Repetition likelihood

---

#### 6.3.2 Claim & Evidence Extractor

Per post:

* Statement type: fact / opinion / prediction
* Verifiability
* Evidence present (yes/no/type)
* Language confidence level

---

#### 6.3.3 Incentive & Disclosure Extractor

Per post:

* Promotional language markers
* Disclosure present or absent
* Conflict-of-interest likelihood

---

#### 6.3.4 Consistency & Narrative Extractor

Across posts:

* Contradictions with past statements
* Narrative shifts
* Selective silence indicators

---

### 6.4 Aggregation Jobs

Runs after all extraction jobs complete.

Aggregates signals at creator level:

* Time-based grouping
* Frequency counts
* Weighted scores

No AI in aggregation.

---

## 7. Outputs & User Experience

### 7.1 Creator Profile Page

Components:

* **Affiliation Map** (entities + strength)
* **Credibility Breakdown** (dimensions + scores)
* **Flagged Posts** (with explanations)
* **Timeline View** (score changes over time)

---

### 7.2 Explainability (Mandatory)

Every signal must be traceable to:

* Specific posts
* Extracted attributes
* Clear reasoning text

---

## 8. Scoring Models (High-Level)

### 8.1 Affiliation Score

Inputs:

* Alignment frequency
* Sentiment strength
* Temporal stability
* Explicit vs implicit ratio

Output:

* Entity-level affiliation score (0–1)

---

### 8.2 Credibility Score

Dimensions:

* Evidence ratio
* Claim confidence vs correctness
* Correction behavior
* Consistency
* Incentive risk

Output:

* Composite credibility score
* Per-dimension breakdown

---

## 9. Non-Functional Requirements

* Scalable async job system
* Deterministic AI outputs (schema enforced)
* Platform rate-limit safe
* GDPR-compliant (public data only)

---

## 10. Risks & Mitigations

### Risk: Defamation / Misinterpretation

Mitigation:

* Use "signals" and "indicators" language
* Avoid absolute claims
* Provide raw evidence links

---

### Risk: AI Hallucination

Mitigation:

* Strict schemas
* Confidence thresholds
* Fallback to "insufficient data"

---

## 11. Out of Scope (MVP)

* Cross-platform aggregation
* Real-time monitoring
* Private content
* Automated fact-check verdicts

---

## 12. Success Metrics

* Creator analysis completion rate
* User engagement with explanations
* Repeat searches per user
* Time spent on creator profile

---

## 13. Future Extensions

* YouTube & Instagram support
* Prediction accuracy tracking
* Community annotations
* Brand risk dashboards

---

## 14. Guiding Principle

> The system does not decide who is trustworthy.
> It reveals patterns so users can decide for themselves.
