/**
 * A generic RateLimiter to protect API usages.
 * Enforces:
 * 1. Minimum interval between calls (spacing).
 * 2. Maximum requests per time window (cap).
 */
export class RateLimiter {
  private queue: Array<() => void> = [];
  private processing: boolean = false;
  private lastCallTime: number = 0;
  private tokens: number;
  private lastRefillTime: number;

  constructor(
    private minIntervalMs: number, // Minimum time between executions
    private maxRequests: number,   // Max requests per window
    private windowMs: number       // Window size in ms
  ) {
    this.tokens = maxRequests;
    this.lastRefillTime = Date.now();
  }

  /**
   * Refills tokens based on time elapsed since last refill.
   */
  private refillTokens() {
    const now = Date.now();
    const timePassed = now - this.lastRefillTime;
    
    if (timePassed > this.windowMs) {
      this.tokens = this.maxRequests;
      this.lastRefillTime = now;
    }
  }

  /**
   * Schedules a task to be executed subject to rate limits.
   * returns a promise that resolves with the result of the task.
   */
  public async schedule<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      this.refillTokens();

      if (this.tokens <= 0) {
        // Window limit reached, wait for refill or a portion of window
        const waitTime = this.windowMs - (Date.now() - this.lastRefillTime) + 100; // +100ms buffer
        if (waitTime > 0) {
            console.log(`[RateLimiter] Limit reached. Waiting ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue; // Re-check after waiting
        }
      }

      // Check minimum interval
      const now = Date.now();
      const timeSinceLastCall = now - this.lastCallTime;
      if (timeSinceLastCall < this.minIntervalMs) {
        await new Promise(resolve => setTimeout(resolve, this.minIntervalMs - timeSinceLastCall));
      }

      // Execute
      const task = this.queue.shift();
      if (task) {
        this.lastCallTime = Date.now();
        this.tokens--;
        
        // Execute the task wrapper (which handles resolve/reject)
        // We don't await the task itself here to block the loop, strictly for timing?
        // Actually for rate limiting we usually want to block the *start* of the next one.
        // But if the task takes long, we don't necessarily want to block the rate limiter if it's "requests sent per minute".
        // However, to be safe and simple: let's fire and forget the implementation, but we wait for the *rate limit constraint* before firing the next.
        task(); 
      }
    }

    this.processing = false;
  }
}
