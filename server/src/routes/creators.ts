import { Router, Request, Response } from 'express';
import { Creator } from '../models/Creator';
import { Signal } from '../models/Signal';
import { URL } from 'url';

const router = Router();

/**
 * Extract Twitter handle from profile URL
 */
function extractTwitterHandle(profileUrl: string): string | null {
  try {
    const url = new URL(profileUrl);
    const host = url.hostname.toLowerCase();
    
    if (!['twitter.com', 'x.com', 'www.twitter.com', 'www.x.com'].includes(host)) {
      return null;
    }
    
    // Extract handle from path (e.g., /elonmusk)
    const handle = url.pathname.split('/')[1]?.replace('@', '');
    return handle?.match(/^[a-zA-Z0-9_]{1,15}$/) ? handle : null;
  } catch {
    return null;
  }
}

/**
 * GET /api/creators?query=<handle_or_name>&page=1&limit=10
 * Search for creators by handle or display name, or list all with pagination
 */
router.get('/creators', async (req: Request, res: Response) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(50, Number(limit))); // Cap limit at 50
    const skip = (pageNum - 1) * limitNum;

    let filter: any = {};
    if (query && typeof query === 'string') {
      filter = {
        $or: [
          { handle: { $regex: query, $options: 'i' } },
          { displayName: { $regex: query, $options: 'i' } },
        ],
      };
    }

    const total = await Creator.countDocuments(filter);
    
    // If no documents found, return early
    if (total === 0) {
      return res.json({
        creators: [],
        pagination: {
          total: 0,
          page: pageNum,
          limit: limitNum,
          totalPages: 0
        }
      });
    }

    const creators = await Creator.find(filter)
      .sort({ affiliationScore: -1, createdAt: -1 }) // Sort by affiliation score desc, then new
      .skip(skip)
      .limit(limitNum)
      .select('handle displayName status affiliationScore credibilityScore profileImage'); // proper field selection

    res.json({
      creators,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/creators
 * Add a new creator for ingestion
 */
router.post('/creators', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Profile URL is required' });
    }

    const handle = extractTwitterHandle(url);
    if (!handle) {
      return res.status(400).json({ error: 'Invalid Twitter/X profile URL' });
    }

    const normalizedHandle = handle.toLowerCase();

    // Check if already exists
    const existing = await Creator.findOne({ handle: normalizedHandle });
    if (existing) {
      if (existing.status === 'PENDING' || existing.status === 'ERROR') {
        // Re-enqueue if stuck
        if (req.app.locals.ingestionQueue) {
          await req.app.locals.ingestionQueue.add('validate-creator', { creatorId: existing._id });
        }
        return res.status(200).json({ 
          message: 'Creator ingestion re-triggered', 
          creator: existing 
        });
      }
      return res.status(409).json({ 
        error: 'Creator already exists and is active', 
        creator: existing 
      });
    }

    // Create with PENDING status
    const creator = await Creator.create({
      handle: normalizedHandle,
      status: 'PENDING',
    });

    // Enqueue validation job (Task 4)
    if (req.app.locals.ingestionQueue) {
      await req.app.locals.ingestionQueue.add('validate-creator', { creatorId: creator._id });
    }

    res.status(201).json({ creator });
  } catch (error) {
    console.error('Error creating creator:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/creators/:handle
 * Get a single creator by handle
 */
router.get('/creators/:handle', async (req: Request, res: Response) => {
  try {
    const handle = req.params.handle as string;
    const creator = await Creator.findOne({ handle: handle.toLowerCase() });

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    res.json({ creator });
  } catch (error) {
    console.error('Error fetching creator:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/creators/:handle/signals
 * Get signals for a single creator by handle
 */
router.get('/creators/:handle/signals', async (req: Request, res: Response) => {
  try {
    const handle = req.params.handle as string;
    const creator = await Creator.findOne({ handle: handle.toLowerCase() });

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    const signals = await Signal.find({ creatorId: creator._id })
      .sort({ createdAt: -1 });

    res.json({ signals });
  } catch (error) {
    console.error('Error fetching signals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
