import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { connectDB } from './config/database';
import { ingestionQueue, signalsQueue, aggregationQueue } from './utils/queues';
import healthRoutes from './routes/health';
import creatorRoutes from './routes/creators';

// Initialize workers
import './workers/ingestion';
import './workers/signalWorker';
import './workers/aggregationWorker';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use(healthRoutes);
app.use('/api', creatorRoutes);

const PORT = config.PORT;

async function bootstrap() {
  await connectDB();
  
  // Make queues available to routes (though shared queues utility is preferred)
  app.locals.ingestionQueue = ingestionQueue;
  app.locals.signalsQueue = signalsQueue;
  app.locals.aggregationQueue = aggregationQueue;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

bootstrap();
