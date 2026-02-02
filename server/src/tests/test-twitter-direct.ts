import { twitterService } from '../services/twitter';
import { connectDB } from '../config/database';
import mongoose from 'mongoose';

async function testTwitter() {
  console.log('🧪 Testing Twitter connectivity...');
  try {
    const profile = await twitterService.getProfile('elonmusk');
    console.log('✅ Success! Profile fetched:');
    console.log(JSON.stringify(profile, null, 2));
  } catch (err) {
    console.error('❌ Twitter Test Failed:');
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testTwitter();
