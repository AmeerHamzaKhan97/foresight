import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'foresight-api',
  });
});

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
