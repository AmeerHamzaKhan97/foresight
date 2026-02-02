import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import { Creator } from '../models/Creator';
import { Signal } from '../models/Signal';

async function seedData() {
  await connectDB();

  try {
    console.log('--- Seeding Mock Data ---');

    // 1. Create a mock creator
    const handle = 'mock_visuals_tech';
    const existing = await Creator.findOne({ handle });
    
    if (existing) {
      console.log(`Creator ${handle} already exists. Skipping.`);
    } else {
      const creator = await Creator.create({
        handle,
        displayName: 'Visual Tech Explorer',
        profileImage: 'https://ui-avatars.com/api/?name=Visual+Tech&background=0D8ABC&color=fff',
        metadata: {
          description: 'Exploring the intersection of AI and visual arts.',
          followersCount: 15600
        },
        platform: 'twitter',
        status: 'ACTIVE',
        affiliationScore: 85,
        credibilityScore: 92
      });
      console.log(`Created mock creator: ${creator.handle}`);

      // 2. Add mock signals
      await Signal.create([
        {
          creatorId: creator._id,
          contentIds: [new mongoose.Types.ObjectId()],
          type: 'affiliation',
          data: {
            entities: [
              { name: 'Stability AI', sentiment: '+', strength: 8 },
              { name: 'Midjourney', sentiment: '+', strength: 7 },
              { name: 'OpenAI', sentiment: '-', strength: 3 }
            ]
          },
          reasoning: 'Strong positive sentiment towards open source AI image generators.'
        },
        {
          creatorId: creator._id,
          contentIds: [new mongoose.Types.ObjectId()],
          type: 'credibility',
          data: {
            claims: [
              { text: 'SDXL 1.0 released today', verifiable: true, hasEvidence: true },
              { text: 'New architecture details confirmed', verifiable: true, hasEvidence: true }
            ],
            overallConfidence: 'High'
          },
          reasoning: 'Consistently posts verifiable technical news with sources.'
        }
      ]);
      console.log('Added mock signals for creator');
    }

    console.log('--- Seeding Complete ---');
    console.log(`You can now search for: ${handle}`);

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedData();
