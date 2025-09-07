const express = require("express");
const app = express();
const router = express.Router();
const limiter = require("../middlewere/rateLimiter");
const cache = require("../config/redis");


router.get('/v1/hello-world', limiter.downloadLimiter, async (req, res) => {
    try {
        const cacheKey = "hello-world-response";

        // 1️⃣ Check cache
        const cachedData = await cache.get(cacheKey);
        if (cachedData) {
            return res.json({ message: cachedData, source: "cache" });
        }

        // 2️⃣ If not cached → generate response
        const responseMessage = "✅ Profile route is rate-limited";

        // 3️⃣ Save to cache (expires in 60 seconds for example)
        await cache.set(cacheKey, responseMessage, 60);

        return res.json({ message: responseMessage, source: "server" });
    } catch (err) {
        console.error("Error handling /v1/hello-world:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;