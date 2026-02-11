import { createWorker } from '../utils/queueFactory';
import { ScoreService } from '../services/scoreService';
import { Signal } from '../models/Signal';
import { Creator } from '../models/Creator';

export const aggregationWorker = createWorker('aggregation-queue', async (job) => {
  const { name, data } = job;

  if (name === 'aggregate-scores') {
    const { creatorId } = data;
    console.log(`[Worker:aggregation] Aggregating scores for creator: ${creatorId}`);

    try {
      // 1. Fetch all signals for this creator
      const signals = await Signal.find({ creatorId });
      
      if (signals.length === 0) {
        console.warn(`[Worker:aggregation] No signals found for creator: ${creatorId}`);
        await Creator.findByIdAndUpdate(creatorId, { status: 'ACTIVE' });
        return;
      }

      // 2. Calculate scores
      const result = ScoreService.calculateScores(signals);

      // 3. Update Creator document
      await Creator.findByIdAndUpdate(creatorId, {
        affiliationScore: Math.round(result.overallAffiliationScore),
        credibilityScore: result.credibility.finalScore,
        status: 'ACTIVE'
      });

      console.log(`[Worker:aggregation] Successfully updated scores for creator: ${creatorId}`);
      console.log(`- Affiliation: ${Math.round(result.overallAffiliationScore)}`);
      console.log(`- Credibility: ${result.credibility.finalScore}`);
    } catch (error) {
      console.error(`[Worker:aggregation] Error aggregating scores for ${creatorId}:`, error);
      await Creator.findByIdAndDelete(creatorId);
      console.log(`[Worker:aggregation] Deleted creator ${creatorId} due to aggregation error`);
      throw error;
    }
  }
});

console.log('👷 Aggregation worker initialized');
