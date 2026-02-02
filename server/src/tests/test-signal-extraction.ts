import mongoose from 'mongoose';
import { config } from '../config/env';
import { Extractor } from '../services/ai/extractor';

async function testSignalExtraction() {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const creatorId = '6973db15c125bbc8d2175406';
    
    console.log('Fetching unanalyzed content...');
    const unanalyzed = await Extractor.getUnanalyzedContent(creatorId);
    console.log(`Found ${unanalyzed.length} unanalyzed items\n`);
    
    if (unanalyzed.length > 0) {
        console.log('Sample item:', {
            id: unanalyzed[0]._id,
            text: unanalyzed[0].text.substring(0, 50),
            analyzed: unanalyzed[0].analyzed,
            creatorId: unanalyzed[0].creatorId
        });
        
        console.log('\nProcessing content...');
        await Extractor.processContent(creatorId);
        console.log('\n✅ Processing complete!');
    }

    await mongoose.disconnect();
    process.exit(0);
}

testSignalExtraction().catch(console.error);
