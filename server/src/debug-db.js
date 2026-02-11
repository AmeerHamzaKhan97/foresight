require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foresight';

const CreatorSchema = new mongoose.Schema({
  handle: String,
  status: String,
  displayName: String,
  profileImage: String,
  affiliationScore: Number,
  createdAt: Date
}, { strict: false });

const Creator = mongoose.model('Creator', CreatorSchema);

async function debug() {
  try {
    console.log('Connecting to:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');

    const count = await Creator.countDocuments({});
    console.log('Total count:', count);

    console.log('Running query with sort and limit...');
    const creators = await Creator.find({})
        .sort({ affiliationScore: -1, createdAt: -1 })
        .skip(0)
        .limit(10)
        .select('handle displayName status affiliationScore credibilityScore profileImage');
    
    console.log(`Found ${creators.length} creators`);
    if (creators.length > 0) {
        console.log('Sample:', creators[0]);
    } else {
        console.log('No creators found with simple query.');
        // Try without sort
        const unsorted = await Creator.find({}).limit(1);
        console.log('Found without sort:', unsorted.length);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

debug();
