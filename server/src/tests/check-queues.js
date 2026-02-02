const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis('redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

async function checkQueues() {
  const qNames = ['ingestion-queue', 'signals-queue', 'aggregation-queue'];
  
  for (const qName of qNames) {
    try {
        const queue = new Queue(qName, { connection });
        const counts = await queue.getJobCounts();
        console.log(`Q: ${qName} -> Waiting: ${counts.waiting}, Active: ${counts.active}, Completed: ${counts.completed}, Failed: ${counts.failed}, Delayed: ${counts.delayed}`);
        
        if (counts.failed > 0) {
            const failedJobs = await queue.getFailed(0, 5);
            failedJobs.forEach(job => {
                console.log(`- FAIL ${job.id}: ${job.failedReason}`);
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
