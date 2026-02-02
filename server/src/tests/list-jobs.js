const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis('redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

async function listJobs() {
  const queue = new Queue('ingestion-queue', { connection });
  const waitingJobs = await queue.getWaiting();
  console.log(`Waiting Jobs: ${waitingJobs.length}`);
  waitingJobs.forEach(job => {
    console.log(`- ID: ${job.id}, Name: ${job.name}, Data: ${JSON.stringify(job.data)}`);
  });

  const activeJobs = await queue.getActive();
  console.log(`Active Jobs: ${activeJobs.length}`);
  activeJobs.forEach(job => {
    console.log(`- ID: ${job.id}, Name: ${job.name}, Data: ${JSON.stringify(job.data)}`);
  });

  await queue.close();
  connection.disconnect();
}

listJobs();
