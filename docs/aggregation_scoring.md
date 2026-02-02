# Aggregation & Scoring Setup: Tasks 14-18 (User Story 3)

## Scope
This document details the implementation of the scientific/mathematical layer of Foresight. We will transform raw AI signals into actionable scores and visualizations.

---

## Task 14: Aggregation Framework
**Objective**: Build the service layer that calculates scores.

### Detailed Steps
1.  **Score Service (`server/src/services/scoreService.ts`)**:
    - Centralize all math here.
    - Input: `Signal[]` for a specific creator.
    - Output: Aggregated metrics.

---

## Task 15: Affiliation Mapping
**Objective**: Determine who or what a creator aligns with.

### Detailed Steps
1.  **Logic**: 
    - Group all signals of type `affiliation`.
    - Group by `entityName` (normalized).
    - Formula: `(Sum of (SentimentValue * Strength)) / TotalOccurrences`.
    - Map sentiment: `positive -> 1`, `negative -> -1`, `neutral -> 0`.

---

## Task 16: Credibility Scoring
**Objective**: Produce a 0-100 score representing trustworthiness.

### Detailed Steps
1.  **Formula Components**:
    - **Evidence Ratio (60%)**: `(Claims with Evidence) / (Total Verifiable Claims)`.
    - **Confidence Alignment (20%)**: Does AI confidence match the language used?
    - **Consistency (20%)**: Absence of contradictions across the dataset.
2.  **Normalization**: Ensure the final score fits a 0-100 scale.

---

## Task 17: Background Aggregation Job
**Objective**: Ensure scores are always fresh.

### Detailed Steps
1.  **Worker**: `server/src/workers/aggregationWorker.ts`.
2.  **Flow**:
    - `extract-signals` (Job ends) -> Enqueue `aggregate-scores` job.
3.  **Persistence**: Update the `Creator` document with new `affiliationScore` and `credibilityScore`.

---

## Task 18: Frontend Score Visualization
**Objective**: Make the data beautiful and "explainable".

### Detailed Steps
1.  **Charts**:
    - Use `recharts` for the score timeline.
    - Build a custom `AffiliationGauge` using SVG or a library.
2.  **Timeline**: Show how the credibility score has fluctuated over the last N tweets.

---

## Questions That Impact Future Development

> [!IMPORTANT]
> **Weighting Bias**: Should extreme negative sentiment carry more weight than extreme positive sentiment in affiliation mapping?
> *Recommendation*: For MVP, use linear weights. We can refine with "Controversy" multipliers later.

> [!QUESTION] **Aggregation Frequency**
> Should we re-aggregate the *entire* history every time a new batch of tweets is analyzed, or only update incrementally?
> *Impact*: Full re-aggregation is more accurate but slower as history grows. For MVP (1,000 tweets limit), full re-aggregation is fine.

---

## Next Steps
Once these tasks are complete, the MVP is functionally finished.

**Proceed to Final Polish & Deployment.**
