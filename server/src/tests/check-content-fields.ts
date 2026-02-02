import mongoose from 'mongoose';
import { config } from '../config/env';

async function checkContentFields() {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const Content = mongoose.model('Content', new mongoose.Schema({}, { strict: false }));
    const contents = await Content.find({ creator: '6973db15c125bbc8d2175406' }).limit(2);
    
    console.log(`Found ${contents.length} content items with 'creator' field\n`);
    if (contents.length > 0) {
        console.log('Sample document fields:', Object.keys(contents[0].toObject()));
        console.log('\nFull document:', JSON.stringify(contents[0], null, 2));
    }

    const contentsById = await Content.find({ creatorId: new mongoose.Types.ObjectId('6973db15c125bbc8d2175406') }).limit(2);
    console.log(`\nFound ${contentsById.length} content items with 'creatorId' field\n`);
    if (contentsById.length > 0) {
        console.log('Sample document fields:', Object.keys(contentsById[0].toObject()));
    }

    await mongoose.disconnect();
    process.exit(0);
}

checkContentFields();
