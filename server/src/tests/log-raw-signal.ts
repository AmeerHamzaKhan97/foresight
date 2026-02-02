import mongoose from 'mongoose';
import { config } from '../config/env';

async function logRawSignal() {
    await mongoose.connect(config.MONGODB_URI);
    const Signal = mongoose.model('Signal', new mongoose.Schema({}, { strict: false }));
    const signal = await Signal.findOne({ type: 'affiliation', creatorId: new mongoose.Types.ObjectId('697f95b5add24059d230f13b') });
    
    if (signal) {
        console.log('--- Raw Affiliation Signal Data ---');
        console.log(JSON.stringify(signal.data, null, 2));
    } else {
        console.log('No affiliation signal found');
    }

    await mongoose.disconnect();
    process.exit(0);
}

logRawSignal();
