import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    // There isn't a direct listModels in the SDK easily accessible without higher level client, 
    // but we can try to see if it works with 'gemini-pro'
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    console.log('Gemini Pro model initialized');
    
    // Let's try to find what works by trial and error or checking the docs/SDK.
    // In @google/generative-ai v0.24.1, maybe gemini-1.5-flash is not the identifier.
  } catch (e) {
    console.error(e);
  }
}

listModels();
