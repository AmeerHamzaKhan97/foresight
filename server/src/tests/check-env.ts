import { config } from '../config/env';

console.log('--- Environment Check ---');
console.log('PORT:', config.PORT);
console.log('Username exists:', !!config.TWITTER_USERNAME);
console.log('Password exists:', !!config.TWITTER_PASSWORD);
console.log('Gemini Key exists:', !!config.GEMINI_API_KEY);
console.log('--- End Check ---');
process.exit(0);
