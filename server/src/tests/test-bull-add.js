const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis('redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

async function testAdd() {
  const queue = new Queue('ingestion-queue', { connection });
  const job = await queue.add('test-job', { foo: 'bar' });
  console.log(`Job added: ${job.id}`);
  
  const counts = await queue.getJobCounts();
  console.log('Counts:', JSON.stringify(counts));
  
  await queue.close();
  connection.disconnect();
}

testAdd();
