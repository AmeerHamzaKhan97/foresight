import { twitterService } from '../services/twitter';

async function testPuppeteer() {
    console.log('🧪 Testing Puppeteer Twitter Scraper...\n');
    
    try {
        console.log('Fetching profile for @elonmusk...');
        const profile = await twitterService.getProfile('elonmusk');
        
        console.log('\n✅ Profile fetched successfully!');
        console.log('Name:', profile.displayName);
        console.log('Followers:', profile.followersCount.toLocaleString());
        console.log('Bio:', profile.description.substring(0, 100) + '...');
        console.log('Image:', profile.profileImage);
        
        console.log('\nFetching latest 5 tweets...');
        const tweets = await twitterService.getTweets('elonmusk', 5);
        
        console.log(`\n✅ Fetched ${tweets.length} tweets!`);
        tweets.forEach((tweet, i) => {
            console.log(`\n${i + 1}. ${tweet.text.substring(0, 80)}...`);
            console.log(`   Likes: ${tweet.favoriteCount}, Retweets: ${tweet.retweetCount}`);
        });
        
        console.log('\n🎉 Puppeteer scraper is working!');
    } catch (error: any) {
        console.error('\n❌ Test failed:', error.message);
    } finally {
        await twitterService.close();
        process.exit(0);
    }
}

testPuppeteer();
