import { createWorker } from '../utils/queueFactory';
import { Creator } from '../models/Creator';
import { Content } from '../models/Content';
import { twitterService } from '../services/twitter';
import { ingestionQueue, signalsQueue } from '../utils/queues';

console.log('👷 Ingestion worker initializing...');

export const ingestionWorker = createWorker('ingestion-queue', async (job) => {
  const { name, data } = job;
  console.log(`[Worker:ingestion] Processing job: ${name} (ID: ${job.id})`);

  if (name === 'validate-creator') {
    const { creatorId } = data;
    console.log(`[Worker:ingestion] Validating creator: ${creatorId}`);

    try {
      const creator = await Creator.findById(creatorId);
      if (!creator) {
        console.error(`[Worker:ingestion] Creator not found: ${creatorId}`);
        return;
      }

      // 1. Fetch profile info
      try {
        const profile = await twitterService.getProfile(creator.handle);
        
        // 2. Update creator metadata
        creator.displayName = profile.displayName;
        creator.profileImage = profile.profileImage;
        creator.metadata = {
          followersCount: profile.followersCount,
          description: profile.description,
        };
        creator.lastIngestedAt = new Date();

        
        await creator.save();
        console.log(`[Worker:ingestion] Successfully validated @${creator.handle}`);

        // 3. Enqueue fetch-content job for next phase
        await ingestionQueue.add('fetch-content', { creatorId: creator._id });
        console.log(`[Worker:ingestion] Enqueued fetch-content for @${creator.handle}`);

      } catch (scrapingError) {
        console.error(`[Worker:ingestion] Scraping error for @${creator.handle}:`, scrapingError);
        creator.status = 'ERROR';
        await creator.save();
      }

    } catch (error) {
      console.error(`[Worker:ingestion] Critical error processing validate-creator ${job.id}:`, error);
      throw error;
    }
  }

  if (name === 'fetch-content') {
    const { creatorId } = data;
    console.log(`[Worker:ingestion] Fetching content for: ${creatorId}`);

    try {
      const creator = await Creator.findById(creatorId);
      if (!creator) return;

      const tweets = await twitterService.getTweets(creator.handle, 20);
      
      const contentItems = tweets.map(tweet => ({
        creatorId: creator._id,
        platform: 'twitter' as const,
        platformId: tweet.id,
        text: tweet.text,
        metadata: {
          retweets: tweet.retweetCount,
          likes: tweet.favoriteCount,
          postedAt: tweet.createdAt,
        },
        analyzed: false
      }));

      // Bulk upsert/insert content
      for (const item of contentItems) {
        await Content.findOneAndUpdate(
          { platformId: item.platformId },
          item,
          { new: true, upsert: true }
        );
      }

      console.log(`[Worker:ingestion] Ingested ${tweets.length} tweets for @${creator.handle}`);

      // Trigger signal extraction
      await signalsQueue.add('extract-signals', { creatorId: creator._id });
      console.log(`[Worker:ingestion] Enqueued extract-signals for @${creator.handle}`);

    } catch (error) {
      console.error(`[Worker:ingestion] Error fetching content for ${creatorId}:`, error);
      throw error;
    }
  }
});

console.log('👷 Ingestion worker initialized');
