import { Creator } from '../models/Creator';
import { ingestionQueue } from '../utils/queues';
import { connectDB } from '../config/database';
import mongoose from 'mongoose';

async function reEnqueue(handle: string) {
  await connectDB();
  const creator = await Creator.findOne({ handle: handle.toLowerCase() });
  
  if (!creator) {
    console.log(`❌ Creator @${handle} not found.`);
    process.exit(1);
  }

  console.log(`Current status: ${creator.status}`);
  
  // Reset status to PENDING if it was ERROR
  if (creator.status === 'ERROR') {
    creator.status = 'PENDING';
    await creator.save();
    console.log(`Status reset to PENDING.`);
  }

  await ingestionQueue.add('validate-creator', { creatorId: creator._id });
  console.log(`✅ Job 'validate-creator' added to queue for @${handle}`);
  
  process.exit(0);
}

const handle = process.argv[2] || 'elonmusk';
reEnqueue(handle);
