import mongoose from 'mongoose';
import { config } from '../config/env';

async function checkScores() {
    await mongoose.connect(config.MONGODB_URI);
    const Creator = mongoose.model('Creator', new mongoose.Schema({}, { strict: false }));
    const creator = await Creator.findOne({ handle: 'billgates' });
    
    if (creator) {
        console.log(`Creator: ${creator.handle}`);
        console.log(`Affiliation Score: ${creator.affiliationScore}`);
        console.log(`Credibility Score: ${creator.credibilityScore}`);
    } else {
        console.log('Creator not found');
    }

    await mongoose.disconnect();
    process.exit(0);
}

checkScores();
