import mongoose from 'mongoose';
import { config } from '../config/env';

async function checkFinalData() {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const creatorId = '697f95b5add24059d230f13b'; // Bill Gates from user logs

    // Check Creator
    const Creator = mongoose.model('Creator', new mongoose.Schema({}, { strict: false }));
    const creator = await Creator.findById(creatorId);
    console.log('--- Creator ---');
    console.log(JSON.stringify(creator, null, 2));

    // Check Signals
    const Signal = mongoose.model('Signal', new mongoose.Schema({}, { strict: false }));
    const signalsCount = await Signal.countDocuments({ creatorId: new mongoose.Types.ObjectId(creatorId) });
    console.log(`\n--- Signals Count: ${signalsCount} ---`);

    // Check one signal if exists
    if (signalsCount > 0) {
        const sampleSignal = await Signal.findOne({ creatorId: new mongoose.Types.ObjectId(creatorId) });
        console.log('Sample Signal:', JSON.stringify(sampleSignal, null, 2));
    }

    await mongoose.disconnect();
    process.exit(0);
}

checkFinalData();
