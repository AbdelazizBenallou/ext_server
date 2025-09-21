// services/cacheService.js
const cache = require("../config/redis");

const cacheService = {
  get: async (key) => {
    try {
      const cached = await cache.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  },

  set: async (key, data, ttl) => {
    try {
      const parsedTTL = parseInt(ttl);
      if (isNaN(parsedTTL) || parsedTTL <= 0) {
        console.error("Invalid TTL value:", ttl);
        return;
      }

      await cache.setex(key, parsedTTL, JSON.stringify(data));
    } catch (error) {
      console.error("Cache set error:", error);
      throw error;
    }
  },

  shouldUseCache: (cachedData, minTimeLeft = 120) => {
    if (!cachedData || !cachedData.expires_at) return false;

    const now = Math.floor(Date.now() / 1000);
    const timeLeft = cachedData.expires_at - now;

    return timeLeft > minTimeLeft;
  },

  buildCacheData: (data, ttl) => {
    const parsedTTL = parseInt(ttl);
    return {
      data,
      expires_at: Math.floor(Date.now() / 1000) + parsedTTL,
    };
  },

  setWithOptions: async (key, data, ttl, options = {}) => {
    try {
      const parsedTTL = parseInt(ttl);
      if (isNaN(parsedTTL) || parsedTTL <= 0) {
        console.error("Invalid TTL value:", ttl);
        return;
      }

      await cache.set(key, JSON.stringify(data), "EX", parsedTTL);
    } catch (error) {
      console.error("Cache set with options error:", error);
      throw error;
    }
  },
};

module.exports = cacheService;
