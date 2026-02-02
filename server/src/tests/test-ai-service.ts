import { extractAffiliations, extractCredibility } from '../services/ai/gemini';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from both server and root
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function runTests() {
  const sampleTweet = `
    Just had an amazing meeting with the team at @Apple. 
    Their commitment to privacy is why I support them. 
    Privacy is a fundamental human right. #Apple #Privacy
  `;

  console.log('--- Testing Affiliation Extraction ---');
  try {
    const affiliations = await extractAffiliations(sampleTweet);
    console.log('Affiliations:', JSON.stringify(affiliations, null, 2));
  } catch (error) {
    console.error('Affiliation Error:', error);
  }

  const claimTweet = `
    According to recent studies, eating 10 apples a day reduces the risk of boredom by 90%. 
    Check out the source here: https://example.com/apple-study
  `;

  console.log('\n--- Testing Credibility Extraction ---');
  try {
    const credibility = await extractCredibility(claimTweet);
    console.log('Credibility:', JSON.stringify(credibility, null, 2));
  } catch (error) {
    console.error('Credibility Error:', error);
  }
}

runTests();
