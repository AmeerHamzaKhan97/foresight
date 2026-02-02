import { ISignal } from '../models/Signal';

export interface AffiliationMetric {
  entityName: string;
  sentimentScore: number; // -1 to 1
  strength: number; // 1-5
  occurrences: number;
}

export interface CredibilityMetric {
  totalClaims: number;
  verifiableClaims: number;
  claimsWithEvidence: number;
  evidenceRatio: number; // 0-1
  confidenceAlignment: number; // 0-1
  consistencyScore: number; // 0-1
  finalScore: number; // 0-100
}

export interface AggregatedScores {
  affiliation: AffiliationMetric[];
  credibility: CredibilityMetric;
  overallAffiliationScore: number; // 0-100 (normalized for UI)
}

/**
 * Service to calculate scores and aggregate metrics from AI-extracted signals.
 */
export class ScoreService {
  /**
   * Main entry point to aggregate all signals for a creator.
   */
  static calculateScores(signals: ISignal[]): AggregatedScores {
    const affiliationSignals = signals.filter(s => s.type === 'affiliation');
    const credibilitySignals = signals.filter(s => s.type === 'credibility');

    const affiliation = this.calculateAffiliation(affiliationSignals);
    const credibility = this.calculateCredibility(credibilitySignals);

    // For overall affiliation score, we might need a more complex heuristic.
    // For now, let's use the average absolute sentiment strength if entities exist.
    const overallAffiliationScore = affiliation.length > 0
      ? (affiliation.reduce((acc, curr) => acc + (Math.abs(curr.sentimentScore) * curr.strength), 0) / 
         affiliation.reduce((acc, curr) => acc + curr.strength, 0)) * 100
      : 0;

    return {
      affiliation,
      credibility,
      overallAffiliationScore
    };
  }

  /**
   * Logic for Task 15: Affiliation Mapping
   * Formula: (Sum of (SentimentValue * Strength)) / TotalOccurrences
   * Note: Result is normalized to -1 to 1 by dividing by max strength (5).
   */
  private static calculateAffiliation(signals: ISignal[]): AffiliationMetric[] {
    const entityMap: Record<string, { totalWeightedSentiment: number; totalStrength: number; count: number }> = {};

    signals.forEach(signal => {
      const data = signal.data;
      if (data && Array.isArray(data.entities)) {
        data.entities.forEach((entity: { name: string; sentiment: string; strength: number }) => {
          if (!entity.name) return;
          
          const name = entity.name.toLowerCase().trim(); // Improved normalization
          
          // Map sentiment: positive -> 1, negative -> -1, neutral -> 0
          let sentimentValue = 0;
          if (entity.sentiment === '+' || entity.sentiment === 'positive') sentimentValue = 1;
          else if (entity.sentiment === '-' || entity.sentiment === 'negative') sentimentValue = -1;
          
          const strength = Number(entity.strength) || 0;
          
          if (!entityMap[name]) {
            entityMap[name] = { totalWeightedSentiment: 0, totalStrength: 0, count: 0 };
          }
          
          entityMap[name].totalWeightedSentiment += (sentimentValue * strength);
          entityMap[name].totalStrength += strength;
          entityMap[name].count += 1;
        });
      }
    });

    return Object.entries(entityMap).map(([name, stats]) => ({
      entityName: name,
      // Formula: (Sum of (SentimentValue * Strength)) / TotalOccurrences
      // Normalized to -1 to 1 (max possible raw score is 5)
      sentimentScore: stats.count > 0 ? (stats.totalWeightedSentiment / stats.count) / 5 : 0,
      strength: stats.count > 0 ? stats.totalStrength / stats.count : 0,
      occurrences: stats.count
    }));
  }

  /**
   * Logic for Task 16: Credibility Scoring
   */
  private static calculateCredibility(signals: ISignal[]): CredibilityMetric {
    let totalClaims = 0;
    let verifiableClaims = 0;
    let claimsWithEvidence = 0;
    let totalConfidenceScore = 0;
    let totalConsistencyScore = 0;
    let signalsWithCredibilityData = 0;

    signals.forEach(signal => {
      const data = signal.data;
      if (!data) return;

      signalsWithCredibilityData++;

      // 1. Evidence Components
      if (Array.isArray(data.claims)) {
        data.claims.forEach((claim: { verifiable: boolean; hasEvidence: boolean }) => {
          totalClaims++;
          if (claim.verifiable) verifiableClaims++;
          if (claim.hasEvidence) claimsWithEvidence++;
        });
      }

      // 2. Confidence Mapping (20% weight)
      // Map overallConfidence (High, Medium, Low) to 0.4 - 1.0 range
      const confidence = (data.overallConfidence || '').toLowerCase();
      if (confidence === 'high') totalConfidenceScore += 1.0;
      else if (confidence === 'medium') totalConfidenceScore += 0.7;
      else if (confidence === 'low') totalConfidenceScore += 0.4;
      else totalConfidenceScore += 0.7; // Default to neutral/medium

      // 3. Consistency (20% weight)
      // Base score of 1.0, deduct if contradictions are found
      let signalConsistency = 1.0;
      if (data.contradictionsFound) {
        signalConsistency = 0.5;
      }
      totalConsistencyScore += signalConsistency;
    });

    // Final Component Calculations
    const evidenceRatio = verifiableClaims > 0 ? claimsWithEvidence / verifiableClaims : 1.0; // Default to 1.0 if no verifiable claims
    const confidenceAlignment = signalsWithCredibilityData > 0 ? totalConfidenceScore / signalsWithCredibilityData : 0.8;
    const consistencyScore = signalsWithCredibilityData > 0 ? totalConsistencyScore / signalsWithCredibilityData : 1.0;

    // Final Normalization (0-100)
    // Formula: (Evidence * 0.6) + (Confidence * 0.2) + (Consistency * 0.2)
    const weightedScore = (evidenceRatio * 0.6) + (confidenceAlignment * 0.2) + (consistencyScore * 0.2);
    const finalScore = Math.round(weightedScore * 100);

    return {
      totalClaims,
      verifiableClaims,
      claimsWithEvidence,
      evidenceRatio,
      confidenceAlignment,
      consistencyScore,
      finalScore
    };
  }
}
