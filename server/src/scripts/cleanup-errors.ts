import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Creator } from './models/Creator';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foresight';

async function cleanup() {
  try {
    console.log('Connecting to:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');

    const result = await Creator.deleteMany({ status: 'ERROR' });
    console.log(`🗑️ Deleted ${result.deletedCount} creators with status 'ERROR'`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanup();
