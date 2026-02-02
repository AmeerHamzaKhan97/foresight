import { config } from '../../config/env';
import { RateLimiter } from '../../utils/rateLimiter';

// Limit: 15 requests per minute (Flash free tier)
const limiter = new RateLimiter(4000, 15, 60 * 1000);

const GEMINI_MODEL = "gemini-2.5-flash"; 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;



const affiliationSchema = {
  description: "List of identified entities (brands, politicians, ideologies) and their sentiment signal.",
  type: "OBJECT",
  properties: {
    entities: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          sentiment: { type: "STRING", enum: ["+", "-"] },
          strength: { type: "NUMBER" }
        },
        required: ["name", "sentiment", "strength"]
      }
    },
    reasoning: { type: "STRING" }
  },
  required: ["entities", "reasoning"]
};

const credibilitySchema = {
  description: "Analysis of claims made and their verifiable nature.",
  type: "OBJECT",
  properties: {
    claims: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          text: { type: "STRING" },
          verifiable: { type: "BOOLEAN" },
          hasEvidence: { type: "BOOLEAN" }
        },
        required: ["text", "verifiable", "hasEvidence"]
      }
    },
    overallConfidence: { type: "STRING" }
  },
  required: ["claims", "overallConfidence"]
};

const callGemini = async (prompt: string, schema: any) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': config.GEMINI_API_KEY || '',
    },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        response_mime_type: "application/json",
        response_schema: schema
      }
    })
  });



  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini API returned empty response");
  }
  return JSON.parse(text);
};


export const extractAffiliations = async (content: string) => {
  return limiter.schedule(async () => {
    const prompt = `
      Analyze the following social media content for affiliations. 
      Focus on:
      - Brands or companies mentioned.
      - Politicians or political parties.
      - Specific ideologies or movements.
      
      Content:
      "${content}"
    `;

    return await callGemini(prompt, affiliationSchema);
  });
};

export const extractCredibility = async (content: string) => {
  return limiter.schedule(async () => {
    const prompt = `
      Analyze the following social media content for credibility and verifiability.
      Focus on:
      - Specific factual claims being made.
      - Whether these claims are verifiable.
      - If the creator provides evidence/links for their claims.
      
      Content:
      "${content}"
    `;

    return await callGemini(prompt, credibilitySchema);
  });
};

