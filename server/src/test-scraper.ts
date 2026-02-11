import { maskSensitiveLogs } from './utils/logger';
maskSensitiveLogs();

import { Scraper } from 'agent-twitter-client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testScraper() {
  const scraper = new Scraper();
  
  const username = process.env.TWITTER_USERNAME;
  const password = process.env.TWITTER_PASSWORD;

  if (!username || !password) {
    console.error('Please set TWITTER_USERNAME and TWITTER_PASSWORD in .env');
    return;
  }

  try {
    console.log('Logging in...');
    await scraper.login(username, password);
    
    const handle = 'elonmusk';
    console.log(`Fetching profile for @${handle}...`);
    const profile = await scraper.getProfile(handle);
    console.log('Profile fields:', Object.keys(profile));
    console.log('Full Profile:', JSON.stringify(profile, null, 2));

    console.log(`Fetching tweets for @${handle}...`);
    const tweetsGenerator = scraper.getTweets(handle, 1);
    const firstTweet = (await tweetsGenerator.next()).value;
    if (firstTweet) {
      console.log('Tweet fields:', Object.keys(firstTweet));
      console.log('Full Tweet:', JSON.stringify(firstTweet, null, 2));
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testScraper();
