require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foresight';

const CreatorSchema = new mongoose.Schema({
  status: String
}, { strict: false });

const Creator = mongoose.model('Creator', CreatorSchema);

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
