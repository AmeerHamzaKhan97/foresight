import mongoose from 'mongoose';
import { config } from '../config/env';

async function checkData() {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Check Content collection
    const Content = mongoose.model('Content', new mongoose.Schema({}, { strict: false }));
    const contents = await Content.find({ creator: '6973db15c125bbc8d2175406' }).limit(5);
    
    console.log(`📄 Found ${contents.length} content items for Elon Musk:`);
    contents.forEach((c: any, i) => {
        console.log(`\n${i + 1}. ${c.text?.substring(0, 60)}...`);
        console.log(`   Analyzed: ${c.analyzed}`);
        console.log(`   ID: ${c._id}`);
    });

    // Check Signal collection
    const Signal = mongoose.model('Signal', new mongoose.Schema({}, { strict: false }));
    const signals = await Signal.find({ creator: '6973db15c125bbc8d2175406' });
    
    console.log(`\n\n🔍 Found ${signals.length} signals for Elon Musk`);
    if (signals.length > 0) {
        signals.forEach((s: any, i) => {
            console.log(`\n${i + 1}. Type: ${s.type}`);
            console.log(`   Value: ${JSON.stringify(s.value).substring(0, 100)}`);
        });
    }

    await mongoose.disconnect();
    process.exit(0);
}

checkData();
