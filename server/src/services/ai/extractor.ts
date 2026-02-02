import mongoose from 'mongoose';
import { Content, IContent } from '../../models/Content';
import { Signal } from '../../models/Signal';
import { extractAffiliations, extractCredibility } from './gemini';

export class Extractor {
  private static BATCH_SIZE = 20;

  /**
   * Fetches unanalyzed content for a specific creator.
   */
  public static async getUnanalyzedContent(creatorId: string): Promise<IContent[]> {
    return await Content.find({
      creatorId: new mongoose.Types.ObjectId(creatorId),
      analyzed: false,
    }).sort({ 'metadata.postedAt': -1 });
  }

  /**
   * Batches content items for processing.
   */
  public static batchContent<T>(items: T[], size: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
      batches.push(items.slice(i, i + size));
    }
    return batches;
  }

  /**
   * Processes all unanalyzed content for a creator.
   */
  public static async processContent(creatorId: string): Promise<void> {
    const unanalyzedItems = await this.getUnanalyzedContent(creatorId);
    
    if (unanalyzedItems.length === 0) {
      console.log(`No unanalyzed content found for creator: ${creatorId}`);
      return;
    }

    const batches = this.batchContent(unanalyzedItems, this.BATCH_SIZE);

    for (const batch of batches) {
      const combinedText = batch.map(item => item.text).join('\n---\n');
      const contentIds = batch.map(item => item._id as mongoose.Types.ObjectId);

      try {
        // 1. Extract Affiliations
        const affiliationData = await extractAffiliations(combinedText);
        await Signal.create({
          contentIds,
          creatorId: new mongoose.Types.ObjectId(creatorId),
          type: 'affiliation',
          data: affiliationData,
          reasoning: affiliationData.reasoning,
        });

        // 2. Extract Credibility
        const credibilityData = await extractCredibility(combinedText);
        await Signal.create({
          contentIds,
          creatorId: new mongoose.Types.ObjectId(creatorId),
          type: 'credibility',
          data: credibilityData,
          reasoning: credibilityData.overallConfidence, 
        });

        // 3. Mark Content as Analyzed
        await Content.updateMany(
          { _id: { $in: contentIds } },
          { $set: { analyzed: true } }
        );

        console.log(`Successfully processed batch of ${batch.length} items for creator: ${creatorId}`);
      } catch (error) {
        console.error(`Error processing batch for creator ${creatorId}:`, error);
        // In a real scenario, we might want to implement a retry mechanism or flag the content as failed.
        // For now, we'll just log the error and continue to the next batch.
      }
    }
  }
}
