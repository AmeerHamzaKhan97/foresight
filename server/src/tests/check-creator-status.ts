import mongoose from 'mongoose';
import { Creator } from '../models/Creator';
import { Content } from '../models/Content';
import { Signal } from '../models/Signal';
import { connectDB } from '../config/database';

async function checkStatus(handle: string) {
  await connectDB();
  
  const creator = await Creator.findOne({ handle });
  if (!creator) {
    console.log(`❌ Creator @${handle} not found in database.`);
    process.exit(0);
  }

  console.log(`\n--- Creator: @${handle} ---`);
  console.log(`Status: ${creator.status}`);
  console.log(`Display Name: ${creator.displayName}`);
  console.log(`Last Ingested: ${creator.lastIngestedAt}`);

  const contentCount = await Content.countDocuments({ creatorId: creator._id });
  const analyzedCount = await Content.countDocuments({ creatorId: creator._id, analyzed: true });
  console.log(`\n--- Content Stats ---`);
  console.log(`Total Tweets: ${contentCount}`);
  console.log(`Analyzed: ${analyzedCount}`);

  const signals = await Signal.find({ creatorId: creator._id });
  console.log(`\n--- Signals ---`);
  console.log(`Total Signals: ${signals.length}`);
  signals.forEach(s => {
    console.log(`- Type: ${s.type}, Count: ${s.data?.length || 0}`);
  });

  await mongoose.disconnect();
}

const handle = process.argv[2] || 'elonmusk';
checkStatus(handle);
