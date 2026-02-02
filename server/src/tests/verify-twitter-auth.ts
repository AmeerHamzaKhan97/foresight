import { twitterService } from '../services/twitter';
import { config } from '../config/env';

async function verifyAuth() {
    console.log('🧪 Verifying Twitter Auth...');
    try {
        const profile = await twitterService.getProfile('elonmusk');
        console.log('✅ Auth is working! Fetched profile for @elonmusk');
        console.log('Name:', profile.displayName);
    } catch (err: any) {
        console.error('❌ Auth Verification Failed:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            // Some libraries hide the data, but let's try
            try {
                const data = await err.response.json();
                console.error('Error Data:', JSON.stringify(data));
            } catch {}
        }
    } finally {
        process.exit(0);
    }
}

verifyAuth();
