const express = require("express");
const app = express();
const {createClient} = require("redis");
const PORT = 3000;

const redisClient = createClient({
    url: "redis://default:YLzwo1NvUiDTngdpwE9iqarSdZPKxJ74@haircut-quill-pin-15285.db.redis.io:13836"
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

const slidingWindowScript = `
    local key = KEYS[1]
    local now = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])
    local limit = tonumber(ARGV[3])
    local clearBefore = now - window

    -- Remove timestamps older than 60 seconds
    redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
    
    -- Count how many requests are left in the window
    local count = redis.call('ZCARD', key)

    if count < limit then
        -- Under the limit! Add the current timestamp and let them in
        redis.call('ZADD', key, now, now)
        -- Set an expiration so old data clears out of memory
        redis.call('EXPIRE', key, window / 1000)
        return 1
    else
        -- Over the limit! Block them
        return 0
    end
`

async function startServer() {

  await redisClient.connect();
  console.log("Connected to Redis Cloud successfully!");

  app.get("/api/data",(req,res) => {
  res.json({message: "Un-throttled endpoint running"});
});



app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
}

startServer();