import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

// Singleton Redis connection
let redisConnection: Redis | null = null;

export function getRedisConnection(): Redis {
  if (!redisConnection) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisConnection = new Redis(redisUrl, {
      maxRetriesPerRequest: null, // Required for BullMQ
    });
    
    redisConnection.on('error', (err: Error) => {
      console.error('❌ Redis connection error:', err);
    });
  }
  return redisConnection;
}

export function createQueue(name: string): Queue {
  return new Queue(name, {
    connection: getRedisConnection() as any,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 500,
    },
  });
}

export function createWorker(
  name: string,
  processor: (job: any) => Promise<any>
): Worker {
  return new Worker(name, processor, {
    connection: getRedisConnection() as any,
    concurrency: 5,
  });
}
