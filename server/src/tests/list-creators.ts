import { Creator } from '../models/Creator';
import { connectDB } from '../config/database';
import mongoose from 'mongoose';

async function listCreators() {
  await connectDB();
  const creators = await Creator.find({});
  console.log(`Total Creators: ${creators.length}`);
  creators.forEach(c => {
    console.log(`- Handle: ${c.handle}, Status: ${c.status}, ID: ${c._id}`);
  });
  process.exit(0);
}

listCreators();
