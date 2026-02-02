require('ts-node').register();
const { ingestionWorker } = require('../workers/ingestion');

console.log('🚀 Temporary Inspection Worker Started...');
console.log('Monitoring ingestion-queue for 60 seconds...');

setTimeout(() => {
  console.log('⏰ Time up. Closing worker.');
  process.exit(0);
}, 60000);
