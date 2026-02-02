import { twitterService } from '../services/twitter';

async function testTwitterV2() {
    console.log('🧪 Testing Twitter API v2 Integration...\n');
    
    try {
        console.log('Fetching profile for @elonmusk...');
        const profile = await twitterService.getProfile('elonmusk');
        
        console.log('\n✅ Profile fetched successfully!');
        console.log('Name:', profile.displayName);
        console.log('Followers:', profile.followersCount.toLocaleString());
        console.log('Bio:', profile.description.substring(0, 100) + '...');
        
        console.log('\nFetching latest 5 tweets...');
        const tweets = await twitterService.getTweets('elonmusk', 5);
        
        console.log(`\n✅ Fetched ${tweets.length} tweets!`);
        tweets.forEach((tweet, i) => {
            console.log(`\n${i + 1}. ${tweet.text.substring(0, 80)}...`);
            console.log(`   Likes: ${tweet.favoriteCount}, Retweets: ${tweet.retweetCount}`);
        });
        
        console.log('\n🎉 Twitter API v2 integration is working!');
    } catch (error: any) {
        console.error('\n❌ Test failed:', error.message);
        if (error.data) {
            console.error('Error details:', JSON.stringify(error.data, null, 2));
        }
    } finally {
        process.exit(0);
    }
}

testTwitterV2();
