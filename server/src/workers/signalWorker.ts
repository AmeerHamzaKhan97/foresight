import { createWorker } from '../utils/queueFactory';
import { Extractor } from '../services/ai/extractor';
import { aggregationQueue } from '../utils/queues';

export const signalWorker = createWorker('signals-queue', async (job) => {
  const { name, data } = job;

  if (name === 'extract-signals') {
    const { creatorId } = data;
    console.log(`[Worker:signals] Extracting signals for creator: ${creatorId}`);

    try {
      await Extractor.processContent(creatorId);
      console.log(`[Worker:signals] Successfully processed signals for creator: ${creatorId}`);

      // SUCCESS -> Trigger scoring aggregation
      await aggregationQueue.add('aggregate-scores', { creatorId });
      console.log(`[Worker:signals] Enqueued aggregation for creator: ${creatorId}`);
    } catch (error) {
      console.error(`[Worker:signals] Error extracting signals for ${creatorId}:`, error);
      throw error; // Allow BullMQ to handle retries
    }
  }
});

console.log('👷 Signal worker initialized');
