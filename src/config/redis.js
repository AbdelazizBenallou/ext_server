const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
  //  password: process.env.REDIS_PASSWORD || '',
  db: 0,
});

(async () => {
  try {
    const testKey = "server-status";
    await redis.setex(testKey, 10, JSON.stringify("Redis is connected ✅")); // TTL 10s
    const value = await redis.get(testKey);
    if (value) {
      console.log("✅ Connected to Redis:", JSON.parse(value));
    } else {
      console.log("⚠️ Redis connection test failed.");
    }
  } catch (err) {
    console.error("❌ Redis connection error:", err);
  }
})();

module.exports = redis;
