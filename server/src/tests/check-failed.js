const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis('redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

async function checkFailed() {
  const queue = new Queue('ingestion-queue', { connection });
  const failedJobs = await queue.getFailed();
  console.log(`Failed Jobs: ${failedJobs.length}`);
  failedJobs.forEach(job => {
    console.log(`- ID: ${job.id}, Name: ${job.name}, Error: ${job.failedReason}`);
  });

  await queue.close();
  connection.disconnect();
}

checkFailed();
