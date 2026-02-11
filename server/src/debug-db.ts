import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
const CreatorSchema = new mongoose.Schema({
  handle: String,
  status: String,
  displayName: String,
  profileImage: String,
}, { strict: false });

const Creator = mongoose.model('Creator', CreatorSchema);

async function debug() {
  try {
    console.log('Connecting to:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    const count = await Creator.countDocuments({});
    console.log('Creator count (via Mongoose):', count);

    const creators = await Creator.find({}).limit(5);
    console.log('Sample creators:', JSON.stringify(creators, null, 2));

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

debug();
