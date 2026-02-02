import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './env';

if (!config.GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY is not defined in environment variables');
}

export const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY || '');

// Default model for exploration and extraction
export const aiModel = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json'
  }
});
