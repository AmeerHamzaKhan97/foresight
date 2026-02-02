import { connectDB } from '../config/database';
import { Creator } from '../models/Creator';
import { Content } from '../models/Content';
import { Signal } from '../models/Signal';
import { Extractor } from '../services/ai/extractor';
import * as gemini from '../services/ai/gemini';
import * as dotenv from 'dotenv';

// Mock the AI service
(gemini as any).extractAffiliations = async () => ({
  entities: [{ name: 'Test Entity', sentiment: '+', strength: 5 }],
  reasoning: 'Mocked reasoning for affiliation'
});

(gemini as any).extractCredibility = async () => ({
  claims: [{ text: 'Mocked claim', verifiable: true, hasEvidence: true }],
  overallConfidence: 'Mocked high confidence'
});
import path from 'path';
import mongoose from 'mongoose';

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function runTest() {
  await connectDB();

  try {
    // 1. Create a dummy creator if none exists
    let creator = await Creator.findOne({ handle: 'test_ocr_extractor' });
    if (!creator) {
      creator = await Creator.create({
        displayName: 'Test Extractor',
        handle: 'test_ocr_extractor',
        status: 'ACTIVE'
      });
    }

    const creatorId = creator._id as mongoose.Types.ObjectId;

    // 2. Clear old test content and signals
    await Content.deleteMany({ creatorId });
    await Signal.deleteMany({ creatorId });

    // 3. Create dummy content
    const contents = [
      {
        creatorId,
        platform: 'twitter',
        platformId: 'test_1_' + Date.now(),
        text: 'I really love what @OpenAI is doing with GPT-4. AI is the future!',
        metadata: { postedAt: new Date() },
        analyzed: false
      },
      {
        creatorId,
        platform: 'twitter',
        platformId: 'test_2_' + Date.now(),
        text: 'The recent economic policy by the government is failing to address inflation.',
        metadata: { postedAt: new Date() },
        analyzed: false
      },
      {
        creatorId,
        platform: 'twitter',
        platformId: 'test_3_' + Date.now(),
        text: 'Claim: Eating chocolate makes you fly. Source: trust me bro.',
        metadata: { postedAt: new Date() },
        analyzed: false
      }
    ];

    await Content.insertMany(contents as any[]);
    console.log('Dummy content created.');

    // 4. Run extractor
    console.log('Running extractor...');
    await Extractor.processContent(creatorId.toString());

    // 5. Verify results
    const signals = await Signal.find({ creatorId });
    console.log(`Found ${signals.length} signals created.`);
    
    signals.forEach(s => {
      console.log(`- Type: ${s.type}`);
      console.log(`  Reasoning: ${s.reasoning}`);
      console.log(`  Data: ${JSON.stringify(s.data, null, 2)}`);
    });

    const unanalyzedCount = await Content.countDocuments({ creatorId, analyzed: false });
    console.log(`Unanalyzed content count: ${unanalyzedCount}`);

    if (unanalyzedCount === 0 && signals.length > 0) {
      console.log('✅ Extraction test passed!');
    } else {
      console.log('❌ Extraction test failed.');
    }

  } catch (error) {
    console.error('Test Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

runTest();
