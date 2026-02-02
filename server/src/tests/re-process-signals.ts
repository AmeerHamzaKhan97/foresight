import mongoose from 'mongoose';
import { config } from '../config/env';
import { Content } from '../models/Content';
import { Signal } from '../models/Signal';
import { signalsQueue } from '../utils/queues';

async function reProcess() {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const creatorId = '697f95b5add24059d230f13b'; // Bill Gates

    // 1. Delete old signals for this creator
    const deleteResult = await Signal.deleteMany({ creatorId: new mongoose.Types.ObjectId(creatorId) });
    console.log(`Deleted ${deleteResult.deletedCount} old signals`);

    // 2. Mark content as unanalyzed so it's picked up again
    const updateResult = await Content.updateMany(
        { creatorId: new mongoose.Types.ObjectId(creatorId) },
        { $set: { analyzed: false } }
    );
    console.log(`Marked ${updateResult.modifiedCount} content items as unanalyzed`);

    // 3. Trigger signal extraction
    await signalsQueue.add('extract-signals', { creatorId });
    console.log('Enqueued extract-signals job');

    await mongoose.disconnect();
    process.exit(0);
}

reProcess().catch(console.error);
