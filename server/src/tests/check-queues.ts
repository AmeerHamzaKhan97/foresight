import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Use environment variable if available, otherwise default to localhost
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
});

async function checkQueues() {
  const qNames = ['ingestion-queue', 'signals-queue', 'aggregation-queue'];
  
  for (const qName of qNames) {
    try {
        const queue = new Queue(qName, { connection });
        const counts = await queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed');
        console.log(`\n--- Queue: ${qName} ---`);
        console.log(JSON.stringify(counts, null, 2));
        
        if (counts.failed > 0) {
            const failedJobs = await queue.getFailed(0, 5);
            console.log(`Last 5 failed jobs:`);
            failedJobs.forEach(job => {
                console.log(`- Job ${job.id}: ${job.failedReason}`);
            });
        }
        await queue.close();
    } catch (err) {
        console.error(`Error checking queue ${qName}:`, err);
    }
  }
  
  connection.disconnect();
  process.exit(0);
}

checkQueues();
