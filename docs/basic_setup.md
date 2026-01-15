# Basic Setup Documentation

> **Epic 1 Foundation: Tasks 1-4**  
> This document consolidates the foundational setup required before building features.

---

## Overview

This document covers the first four tasks of the project:

| Task | Name | Purpose |
|------|------|---------|
| 1 | Project Structure & Environment | Monorepo setup with client/server |
| 2 | Database Layer | MongoDB connection & Creator schema |
| 3 | Basic API Implementation | Health check & CRUD endpoints |
| 4 | Job Queue Infrastructure | BullMQ + Redis for async processing |

---

## Task 1: Project Structure & Environment

### 1.1 Initialize Root Monorepo

**Files to Create:**
```
foresight/
├── package.json          # Root workspace config
├── .gitignore            # Ignore node_modules, .env, etc.
├── .env.example          # Template for environment variables
├── client/               # React frontend (Vite)
└── server/               # Express backend + Workers
```

**Root `package.json` Example:**
```json
{
  "name": "foresight",
  "private": true,
  "workspaces": ["client", "server"],
  "scripts": {
    "dev:client": "npm run dev --workspace=client",
    "dev:server": "npm run dev --workspace=server",
    "dev": "concurrently \"npm:dev:*\""
  },
  "devDependencies": {
    "concurrently": "^8.x"
  }
}
```

### 1.2 Setup Server Directory

**Server Dependencies:**
```bash
cd server
npm init -y
npm install express mongoose dotenv cors helmet
npm install -D nodemon typescript @types/node @types/express
```

**Server Structure:**
```
server/
├── package.json
├── src/
│   ├── index.ts          # Entry point
│   ├── config/
│   │   └── env.ts        # Environment variable loader
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
│   ├── services/         # Business logic
│   └── workers/          # BullMQ job processors
└── tsconfig.json
```

### 1.3 Setup Client Directory

**Client Setup (Vite + React + Tailwind):**
```bash
cd client
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Client Structure:**
```
client/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   ├── pages/
│   └── api/              # API client layer
└── index.html
```

### 1.4 Environment Variables

**`.env.example` Template:**
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/foresight

# Redis (for BullMQ)
REDIS_URL=redis://localhost:6379

# AI Provider
GEMINI_API_KEY=your_gemini_api_key_here

# Twitter Scraper (optional credentials)
TWITTER_USERNAME=
TWITTER_PASSWORD=
```

> [!IMPORTANT]
> **Security**: Never commit `.env` files. Use `.env.example` as a template and document all required variables.

---

## Task 2: Database Layer

### 2.1 MongoDB Connection

**Connection Service (`server/src/config/database.ts`):**
```typescript
import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foresight';
  
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}
```

### 2.2 Creator Schema

**Model (`server/src/models/Creator.ts`):**
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export type CreatorStatus = 'PENDING' | 'ACTIVE' | 'ERROR';

export interface ICreator extends Document {
  handle: string;
  platform: 'twitter';
  status: CreatorStatus;
  displayName?: string;
  profileImage?: string;
  metadata: {
    followersCount?: number;
    description?: string;
  };
  lastIngestedAt?: Date;
  affiliationScore?: number;
  credibilityScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CreatorSchema = new Schema<ICreator>(
  {
    handle: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true,
      lowercase: true,
      trim: true
    },
    platform: { 
      type: String, 
      enum: ['twitter'], 
      default: 'twitter' 
    },
    status: { 
      type: String, 
      enum: ['PENDING', 'ACTIVE', 'ERROR'], 
      default: 'PENDING' 
    },
    displayName: String,
    profileImage: String,
    metadata: {
      followersCount: Number,
      description: String,
    },
    lastIngestedAt: Date,
    affiliationScore: { type: Number, min: 0, max: 100 },
    credibilityScore: { type: Number, min: 0, max: 100 },
  },
  { timestamps: true }
);

export const Creator = mongoose.model<ICreator>('Creator', CreatorSchema);
```

> [!NOTE]
> The `handle` field is indexed and unique. Always normalize handles (lowercase, trim) before saving.

---

## Task 3: Basic API Implementation

### 3.1 Health Endpoint

**Route (`server/src/routes/health.ts`):**
```typescript
import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'foresight-api',
  });
});

export default router;
```

### 3.2 Creator Search (`GET /api/creators`)

**Implementation Notes:**
- Query parameter: `?query=<handle_or_name>`
- Use regex for partial matching
- Limit results (default: 20)

```typescript
router.get('/api/creators', async (req, res) => {
  const { query, limit = 20 } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.json({ creators: [] });
  }

  const creators = await Creator.find({
    $or: [
      { handle: { $regex: query, $options: 'i' } },
      { displayName: { $regex: query, $options: 'i' } },
    ],
  })
    .limit(Number(limit))
    .select('handle displayName status affiliationScore credibilityScore');

  res.json({ creators });
});
```

### 3.3 Add Creator (`POST /api/creators`)

**Input Validation (MVP):**
```typescript
import { URL } from 'url';

function extractTwitterHandle(profileUrl: string): string | null {
  try {
    const url = new URL(profileUrl);
    const host = url.hostname.toLowerCase();
    
    if (!['twitter.com', 'x.com'].includes(host)) {
      return null;
    }
    
    // Extract handle from path (e.g., /elonmusk)
    const handle = url.pathname.split('/')[1]?.replace('@', '');
    return handle?.match(/^[a-zA-Z0-9_]{1,15}$/) ? handle : null;
  } catch {
    return null;
  }
}

router.post('/api/creators', async (req, res) => {
  const { url } = req.body;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Profile URL is required' });
  }

  const handle = extractTwitterHandle(url);
  if (!handle) {
    return res.status(400).json({ error: 'Invalid Twitter/X profile URL' });
  }

  // Check if already exists
  const existing = await Creator.findOne({ handle: handle.toLowerCase() });
  if (existing) {
    return res.status(409).json({ 
      error: 'Creator already exists', 
      creator: existing 
    });
  }

  // Create with PENDING status
  const creator = await Creator.create({
    handle: handle.toLowerCase(),
    status: 'PENDING',
  });

  // TODO: Enqueue validation job (Task 4)
  // await ingestionQueue.add('validate-creator', { creatorId: creator._id });

  res.status(201).json({ creator });
});
```

---

## Task 4: Job Queue Infrastructure

### 4.1 Redis + BullMQ Setup

**Install Dependencies:**
```bash
cd server
npm install bullmq ioredis
```

### 4.2 Queue Factory Utility

**Utility (`server/src/utils/queueFactory.ts`):**
```typescript
import { Queue, Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';

// Singleton Redis connection
let redisConnection: Redis | null = null;

export function getRedisConnection(): Redis {
  if (!redisConnection) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisConnection = new Redis(redisUrl, {
      maxRetriesPerRequest: null, // Required for BullMQ
    });
  }
  return redisConnection;
}

export function createQueue(name: string): Queue {
  return new Queue(name, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 500,
    },
  });
}

export function createWorker(
  name: string,
  processor: (job: any) => Promise<any>
): Worker {
  return new Worker(name, processor, {
    connection: getRedisConnection(),
    concurrency: 5,
  });
}
```

### 4.3 Initialize Ingestion Queue

**Server Initialization (`server/src/index.ts`):**
```typescript
import express from 'express';
import { connectDB } from './config/database';
import { createQueue } from './utils/queueFactory';
import healthRoutes from './routes/health';
import creatorRoutes from './routes/creators';

const app = express();
app.use(express.json());

// Routes
app.use(healthRoutes);
app.use(creatorRoutes);

// Initialize
const PORT = process.env.PORT || 5000;

async function bootstrap() {
  // Connect to MongoDB
  await connectDB();
  
  // Initialize queues
  const ingestionQueue = createQueue('ingestion-queue');
  console.log('✅ Ingestion queue ready');
  
  // Make queue available to routes
  app.locals.ingestionQueue = ingestionQueue;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

bootstrap();
```

---

## Questions That Impact Future Development

> [!CAUTION]
> Please answer these questions before proceeding with implementation, as they affect architectural decisions.

### Environment & Infrastructure

1. **Local Development Stack**: Do you want a `docker-compose.yml` for local MongoDB + Redis, or will you use cloud services (e.g., MongoDB Atlas, Upstash Redis)?

2. **TypeScript Configuration**: Should we use strict TypeScript (`strict: true`) in both client and server from the start?

3. **ESLint/Prettier**: Should we set up linting and code formatting rules now, or defer to later?

---

### Database Design

4. **Handle Case Sensitivity**: Should `@ElonMusk` and `@elonmusk` be treated as the same creator? *(Current assumption: Yes, normalize to lowercase)*

5. **Soft Delete**: Should we implement soft delete (`deletedAt` field) for creators, or hard delete?

6. **Indexing Strategy**: Beyond `handle`, should we index `status` for filtering (e.g., list all PENDING creators)?

---

### API Design

7. **API Versioning**: Should endpoints be versioned (e.g., `/api/v1/creators`) for future compatibility?

8. **Rate Limiting**: Should we implement API rate limiting now (e.g., `express-rate-limit`)?

9. **CORS Configuration**: What origins should be allowed? Only the frontend domain, or more permissive for development?

---

### Job Queue Configuration

10. **Worker Deployment**: Will workers run in the same process as the API server, or as separate services?

11. **Job Priorities**: Should some jobs (e.g., `validate-creator`) have higher priority than others?

12. **Retry Limits**: How many times should a failed job retry before marking the creator as `ERROR`? *(Current: 3 attempts with exponential backoff)*

---

### Development Workflow

13. **Monorepo vs Polyrepo**: Are you comfortable with npm workspaces, or prefer independent `client/` and `server/` directories?

14. **Hot Reload**: Should we configure hot-reload for both client (Vite HMR) and server (nodemon)?

15. **Seed Data**: Do you want a seed script to populate sample creators for UI development?

---

## Next Steps After Setup

Once these tasks are complete, the project will have:

- ✅ Working monorepo structure
- ✅ Database connection with Creator model
- ✅ Basic API endpoints (health, search, add)
- ✅ Job queue infrastructure ready

**Proceed to:**
- Task 5: Ingestion Worker Logic (TwitterScraper + Job Processors)
- Task 6: Frontend Foundation (API Client + Layout)

---

## Verification Checklist

Before moving to the next epic, verify:

- [x] `npm install` succeeds in root directory
- [x] `npm run dev` starts both client and server
- [x] `GET /health` returns `{ status: 'ok' }`
- [ ] MongoDB connection established (check console logs)
- [ ] Redis connection established (check console logs)
- [ ] `POST /api/creators` with valid URL creates a PENDING creator
- [ ] `GET /api/creators?query=test` returns search results
