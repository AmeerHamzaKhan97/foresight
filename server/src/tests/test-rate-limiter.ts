import { RateLimiter } from '../utils/rateLimiter';

const testRateLimiter = async () => {
    console.log('🧪 Testing RateLimiter...');

    // Scenario 1: Min Interval
    // Limit: 500ms between calls
    console.log('\n--- Scenario 1: Min Interval (500ms) ---');
    const intervalLimiter = new RateLimiter(500, 10, 60000);
    const start1 = Date.now();
    
    for (let i = 1; i <= 5; i++) {
        await intervalLimiter.schedule(async () => {
            console.log(`Task ${i} executed at ${Date.now() - start1}ms`);
        });
    }

    // Scenario 2: Window Limit
    // Limit: Max 3 requests per 3 seconds
    console.log('\n--- Scenario 2: Window Limit (Max 3 per 3s) ---');
    const windowLimiter = new RateLimiter(100, 3, 3000); // 100ms interval, 3 reqs, 3s window
    const start2 = Date.now();

    for (let i = 1; i <= 6; i++) {
        // execute in parallel (fire and forget from caller perspective, but limiter should queue them)
         windowLimiter.schedule(async () => {
            console.log(`Window Task ${i} executed at ${Date.now() - start2}ms`);
        });
    }

    // Wait for a bit to let specific window tasks finish
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('✅ Done');
};

testRateLimiter();
