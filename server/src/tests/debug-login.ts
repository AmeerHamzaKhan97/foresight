import { Scraper } from 'agent-twitter-client';
import { config } from '../config/env';

async function debugLogin() {
    console.log('🚀 Starting Debug Login...');
    const scraper = new Scraper();
    
    console.log(`Setting up test (NO LOGIN)...`);
    try {
        console.log('Fetching profile for elonmusk (no login)...');
        const profile = await scraper.getProfile('elonmusk');
        console.log('✅ Profile fetched:', JSON.stringify(profile, null, 2));
    } catch (err) {
        console.error('❌ Direct fetch failed:', err);
    } finally {
        process.exit(0);
    }
}

debugLogin();
