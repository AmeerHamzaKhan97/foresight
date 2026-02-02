import { createQueue } from './queueFactory';

export const ingestionQueue = createQueue('ingestion-queue');
export const signalsQueue = createQueue('signals-queue');
export const aggregationQueue = createQueue('aggregation-queue');

console.log('✅ Queues initialized: ingestion-queue, signals-queue, aggregation-queue');
