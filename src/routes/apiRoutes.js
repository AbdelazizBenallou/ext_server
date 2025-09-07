const express = require("express");
const app = express();
const router = express.Router();
const limiter = require("../middlewere/rateLimiter");

router.get('/v1/hello-world',limiter.downloadLimiter, (req, res) => {
    res.json({ message: "✅ Profile route is rate-limited" });
});



module.exports = router;