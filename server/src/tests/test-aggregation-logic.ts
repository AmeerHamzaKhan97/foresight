import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import { Creator } from '../models/Creator';
import { Signal } from '../models/Signal';
import { ScoreService } from '../services/scoreService';

// We'll test the core logic of the worker without BullMQ infrastructure
// because Redis might not be available in the test environment.
async function testAggregationLogic() {
  await connectDB();

  try {
    console.log('--- Testing Aggregation Logic ---');

    // 1. Create a temporary creator
    const creator = await Creator.create({
      handle: `test_logic_${Date.now()}`,
      displayName: 'Test Logic',
      status: 'ACTIVE'
    });
    console.log(`Created test creator: ${creator._id}`);

    // 2. Add mock signals
    await Signal.create([
      {
        creatorId: creator._id,
        contentIds: [new mongoose.Types.ObjectId()],
        type: 'affiliation',
        data: {
          entities: [
            { name: 'OpenAI', sentiment: '+', strength: 5 }
          ]
        },
        reasoning: 'Testing'
      },
      {
        creatorId: creator._id,
        contentIds: [new mongoose.Types.ObjectId()],
        type: 'credibility',
        data: {
          claims: [
            { text: 'Claim 1', verifiable: true, hasEvidence: true }
          ],
          overallConfidence: 'High',
          contradictionsFound: false
        },
        reasoning: 'Testing'
      }
    ]);
    console.log('Added mock signals');

    // 3. Simulate Worker Processor Logic
    console.log('Simulating aggregation worker logic...');
    const signals = await Signal.find({ creatorId: creator._id });
    const result = ScoreService.calculateScores(signals);
    
    await Creator.findByIdAndUpdate(creator._id, {
      affiliationScore: Math.round(result.overallAffiliationScore),
      credibilityScore: result.credibility.finalScore
    });

    // 4. Verify results
    const updatedCreator = await Creator.findById(creator._id);
    if (updatedCreator && updatedCreator.affiliationScore === 100 && updatedCreator.credibilityScore === 100) {
      console.log('✅ Logic verification successful!');
      console.log(`- Affiliation Score: ${updatedCreator.affiliationScore}`);
      console.log(`- Credibility Score: ${updatedCreator.credibilityScore}`);
    } else {
      console.error('❌ Logic verification failed.', updatedCreator);
    }

    // Cleanup
    await Creator.findByIdAndDelete(creator._id);
    await Signal.deleteMany({ creatorId: creator._id });
    console.log('Cleaned up test data');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testAggregationLogic();
