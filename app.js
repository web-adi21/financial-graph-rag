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

    redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
    
    local count = redis.call('ZCARD', key)

    if count < limit then
         
        redis.call('ZADD', key, now, now)
  
        redis.call('EXPIRE', key, window / 1000)
        return 1
    else
     
        return 0
    end
`

async function rateLimiter(req,res,next) {
  const uuserIp = req.ip;
  const now = Date.now();
  const windowMs = 60000;
  const limit = 5;

  try {
    const result = await redisClient.sendCommand([
      'EVAL',
      slidingWindowScript,
      '1',
      uuserIp,
      now.toString(),
      windowMs.toString(),
      limit.toString()
    ]);

    if(result === 1){
      next();
    } else {
      res.status(429).json({error: "Too many requests . Please wait a minute"});
    }
  } catch (error) {
      console.error("Rate limiter Error: " , error);
      res.status(500).json({error : "Internal Server Error"})
  }
  
  
}

async function startServer() {

  await redisClient.connect();
  console.log("Connected to Redis Cloud successfully!");

  app.get("/api/data" , rateLimiter,(req,res) => {
  res.json({message: "Un-throttled endpoint running"});
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
}

startServer();