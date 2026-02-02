import puppeteer, { Browser, Page } from 'puppeteer';
import { config } from '../config/env';
import { RateLimiter } from '../utils/rateLimiter';

export class TwitterService {
  private browser: Browser | null = null;
  // Limit: 1 request every 5 seconds, max 12 per minute (conservative)
  private limiter: RateLimiter = new RateLimiter(5000, 12, 60 * 1000);

  constructor() {
    console.log('✅ Puppeteer Twitter scraper initialized');
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      console.log('[TwitterService] Browser launched');
    }
    return this.browser;
  }

  private async getPage(): Promise<Page> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    // Set cookies if available
    if (config.TWITTER_COOKIES) {
      try {
        const cookies = JSON.parse(config.TWITTER_COOKIES);
        const puppeteerCookies = cookies.map((c: any) => ({
          name: c.name,
          value: c.value,
          domain: c.domain.startsWith('.') ? c.domain : `.${c.domain}`,
          path: c.path || '/',
          httpOnly: c.httpOnly || false,
          secure: c.secure || false,
          sameSite: 'Lax' as const
        }));
        
        await page.setCookie(...puppeteerCookies);
        console.log(`[TwitterService] Set ${puppeteerCookies.length} cookies`);
      } catch (error) {
        console.warn('[TwitterService] Failed to set cookies:', error);
      }
    }
    
    return page;
  }

  /**
   * Fetch profile metadata for a handle
   */
  async getProfile(handle: string) {
    return this.limiter.schedule(async () => {
      const page = await this.getPage();
      
      try {
        const username = handle.replace('@', '');
        const url = `https://twitter.com/${username}`;
        
        console.log(`[TwitterService] Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Wait for profile to load
        await page.waitForSelector('[data-testid="UserName"]', { timeout: 10000 });
        
        // Extract profile data
        const profileData = await page.evaluate(() => {
          const getName = () => {
            const nameEl = document.querySelector('[data-testid="UserName"]');
            return nameEl?.textContent?.split('@')[0]?.trim() || '';
          };
          
          const getFollowers = () => {
            const followersLink = Array.from(document.querySelectorAll('a')).find(
              a => a.href.includes('/verified_followers') || a.href.includes('/followers')
            );
            const text = followersLink?.textContent || '0';
            const match = text.match(/([0-9,.]+[KMB]?)/);
            if (!match) return 0;
            
            const num = match[1].replace(/,/g, '');
            if (num.includes('K')) return parseFloat(num) * 1000;
            if (num.includes('M')) return parseFloat(num) * 1000000;
            if (num.includes('B')) return parseFloat(num) * 1000000000;
            return parseInt(num);
          };
          
          const getBio = () => {
            const bioEl = document.querySelector('[data-testid="UserDescription"]');
            return bioEl?.textContent || '';
          };
          
          const getProfileImage = () => {
            const imgEl = document.querySelector('[data-testid="UserAvatar-Container-unknown"] img');
            return (imgEl as HTMLImageElement)?.src?.replace('_normal', '_400x400') || '';
          };
          
          return {
            displayName: getName(),
            followersCount: getFollowers(),
            description: getBio(),
            profileImage: getProfileImage()
          };
        });
        
        console.log(`[TwitterService] ✅ Fetched profile for @${username}`);
        return profileData;
      } catch (error: any) {
        console.error(`[TwitterService] Error fetching profile for @${handle}:`, error.message);
        throw error;
      } finally {
        await page.close();
      }
    });
  }

  /**
   * Fetch latest tweets for a handle
   */
  async getTweets(handle: string, count: number = 20) {
    return this.limiter.schedule(async () => {
      const page = await this.getPage();
      
      try {
        const username = handle.replace('@', '');
        const url = `https://twitter.com/${username}`;
        
        console.log(`[TwitterService] Fetching tweets from ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Wait for tweets to load
        await page.waitForSelector('article[data-testid="tweet"]', { timeout: 10000 });
        
        // Scroll to load more tweets
        for (let i = 0; i < Math.ceil(count / 10); i++) {
          await page.evaluate(() => window.scrollBy(0, window.innerHeight));
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Extract tweet data
        const tweets = await page.evaluate((maxCount) => {
          const tweetElements = document.querySelectorAll('article[data-testid="tweet"]');
          const results = [];
          
          for (let i = 0; i < Math.min(tweetElements.length, maxCount); i++) {
            const article = tweetElements[i];
            
            const getText = () => {
              const textEl = article.querySelector('[data-testid="tweetText"]');
              return textEl?.textContent || '';
            };
            
            const getMetrics = (testId: string) => {
              const el = article.querySelector(`[data-testid="${testId}"]`);
              const text = el?.textContent || '0';
              const match = text.match(/([0-9,.]+[KMB]?)/);
              if (!match) return 0;
              
              const num = match[1].replace(/,/g, '');
              if (num.includes('K')) return Math.floor(parseFloat(num) * 1000);
              if (num.includes('M')) return Math.floor(parseFloat(num) * 1000000);
              if (num.includes('B')) return Math.floor(parseFloat(num) * 1000000000);
              return parseInt(num) || 0;
            };
            
            const getTime = () => {
              const timeEl = article.querySelector('time');
              return timeEl?.getAttribute('datetime') || new Date().toISOString();
            };
            
            const getId = () => {
              const links = article.querySelectorAll('a');
              for (const link of links) {
                const match = link.href.match(/status\/(\d+)/);
                if (match) return match[1];
              }
              return `tweet_${i}_${Date.now()}`;
            };
            
            results.push({
              id: getId(),
              text: getText(),
              createdAt: getTime(),
              retweetCount: getMetrics('retweet'),
              favoriteCount: getMetrics('like')
            });
          }
          
          return results;
        }, count);
        
        console.log(`[TwitterService] ✅ Fetched ${tweets.length} tweets for @${username}`);
        return tweets;
      } catch (error: any) {
        console.error(`[TwitterService] Error fetching tweets for @${handle}:`, error.message);
        throw error;
      } finally {
        await page.close();
      }
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('[TwitterService] Browser closed');
    }
  }
}

export const twitterService = new TwitterService();

// Cleanup on process exit
process.on('SIGINT', async () => {
  await twitterService.close();
  process.exit(0);
});
