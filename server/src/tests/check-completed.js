const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis('redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

async function checkCompleted() {
  const queue = new Queue('ingestion-queue', { connection });
  const completedJobs = await queue.getCompleted(0, 5);
  console.log(`Completed Jobs: ${completedJobs.length}`);
  completedJobs.forEach(job => {
    console.log(`- ID: ${job.id}, Name: ${job.name}, Return: ${JSON.stringify(job.returnvalue)}`);
  });

  await queue.close();
  connection.disconnect();
}

checkCompleted();
