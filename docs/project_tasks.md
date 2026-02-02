# Task List: Creator Affiliation & Credibility Analyzer (Foresight)

- [x] Analyze PRD and Draft Technical Design
    - [x] Create `docs/technical_design.md` skeleton
    - [x] Define System Architecture (High Level)
    - [x] Define Database Schema (Models)
    - [x] Define API Endpoints
    - [x] Define Ingestion & AI Pipeline
- [x] Review and Refine Design
    - [x] Identify Ambiguities and Questions
    - [x] Update Design based on User Feedback
    - [x] Create Technical Approach & User Stories (`docs/technical_approach.md`)

## Epic 1: Creator Discovery & Ingestion (US-1) - COMPLETED
- [x] **1. Project Structure & Environment** (Foundation)
- [x] **2. Database Layer** (Dependency for API)
- [x] **3. Basic API Implementation** (Dependency for Frontend)
- [x] **4. Job Queue Infrastructure** (Dependency for Workers)
- [x] **5. Ingestion Worker Logic** (Core Logic)
- [x] **6. Frontend Foundation** (UI Shell)
- [x] **7. Feature: Creator Search** (User Story 1.1)
- [x] **8. Feature: Add Creator** (User Story 1.2)

## Epic 2: AI Signal Analysis (US-2) - COMPLETED
- [x] **9. Environment & Models Setup**
- [x] **10. AI Service Layer & Prompting**
- [x] **11. Signal Extraction logic**
- [x] **12. AI Pipeline Background Workers**
- [x] **13. API & Frontend Integration**

## Epic 3: Aggregation & Scoring (US-3)
- [ ] **14. Aggregation Framework**
    - [ ] Implement `ScoreService` to calculate weighted averages.
    - [ ] Create logic to aggregate `Signal` documents by type.
- [ ] **15. Affiliation Mapping**
    - [ ] Implement entity-level aggregation (grouping sentiments for specific brands/politicians).
    - [ ] Calculate "Alignment Strength" for each entity.
- [ ] **16. Credibility Scoring**
    - [ ] Implement formula for "Evidence Ratio" (Verifiable Claims / Total Claims).
    - [ ] Factor in "Consistency" across different time windows.
- [ ] **17. Background Aggregation Job**
    - [ ] Create `aggregate-scores` BullMQ worker.
    - [ ] Trigger aggregation after AI extraction completes.
- [ ] **18. Frontend Score Visualization**
    - [ ] Implement `CredibilityMeter` (Gauge chart).
    - [ ] Implement `AffiliationMap` (List/Circle Pack of aligned entities).
    - [ ] Add `ScoreTimeline` using Recharts (score changes over time).

## Final Phase
- [ ] **19. Final Polish & Deployment Preparation**
