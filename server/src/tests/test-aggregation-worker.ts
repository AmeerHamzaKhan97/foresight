import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import { Creator } from '../models/Creator';
import { Signal } from '../models/Signal';
import { aggregationQueue } from '../utils/queues';
import '../workers/aggregationWorker'; // Import to register the worker

async function testAggregation() {
  await connectDB();

  try {
    console.log('--- Testing Background Aggregation ---');

    // 1. Create a temporary creator
    const creator = await Creator.create({
      handle: `test_user_${Date.now()}`,
      displayName: 'Test User',
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
          overallConfidence: 'High'
        },
        reasoning: 'Testing'
      }
    ]);
    console.log('Added mock signals');

    // 3. Enqueue aggregation job
    console.log('Enqueuing aggregate-scores job...');
    await aggregationQueue.add('aggregate-scores', { creatorId: creator._id });

    // 4. Wait for processing (polling the DB)
    console.log('Waiting for scores to be updated...');
    let updatedCreator;
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updatedCreator = await Creator.findById(creator._id);
      if (updatedCreator?.affiliationScore !== undefined) break;
    }

    if (updatedCreator && updatedCreator.affiliationScore !== undefined) {
      console.log('✅ Scores updated successfully!');
      console.log(`- Affiliation Score: ${updatedCreator.affiliationScore}`);
      console.log(`- Credibility Score: ${updatedCreator.credibilityScore}`);
    } else {
      console.error('❌ Timeout: Scores not updated.');
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

testAggregation();
