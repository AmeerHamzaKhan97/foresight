const IORedis = require('ioredis');
const connection = new IORedis('redis://localhost:6379');

async function listKeys() {
    const keys = await connection.keys('bull:*');
    console.log(`Total Bull Keys: ${keys.length}`);
    keys.sort().forEach(k => console.log(k));
    process.exit(0);
}

listKeys();
