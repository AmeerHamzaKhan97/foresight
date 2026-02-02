import axios from 'axios';
import { config } from '../config/env';

async function testRaw() {
    console.log('🧪 Testing raw cookies...');
    if (!config.TWITTER_COOKIES) {
        console.log('No cookies in config.');
        return;
    }

    try {
        const cookiesJSON = JSON.parse(config.TWITTER_COOKIES);
        const cookieHeader = cookiesJSON.map((c: any) => `${c.name}=${c.value}`).join('; ');
        const ct0 = cookiesJSON.find((c: any) => c.name === 'ct0')?.value;

        console.log('Requesting home timeline (raw)...');
        const response = await axios.get('https://x.com/i/api/graphql/mG_mK7I_n98OQdbeuv1C6w/HomeLatestTimeline', {
            headers: {
                'Cookie': cookieHeader,
                'x-csrf-token': ct0,
                'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAFQODgEAAAAAVHTp76lzh3rFzcHbmHVvQxYYpTw%3DckAlMINMjmCwxUcaXbAN4XqJVdgMJaHqNOFgPMK0zN1qLqLQCF'
            }
        });

        console.log('✅ Success! Raw cookies work.');
        console.log('Status:', response.status);
    } catch (err: any) {
        console.error('❌ Raw Test Failed:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', JSON.stringify(err.response.data));
        }
    } finally {
        process.exit(0);
    }
}

testRaw();
