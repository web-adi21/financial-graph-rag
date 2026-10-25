const express = require("express");
const app = express();
const {createClient} = require("redis");
const PORT = 3000;

const redisClient = createClient({
    url: "redis://default:YLzwo1NvUiDTngdpwE9iqarSdZPKxJ74@haircut-quill-pin-15285.db.redis.io:13836"
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

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