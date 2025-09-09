async function cacheOrFetch(cacheKey, ttl, fetchFunction) {
  const cached = await cache.get(cacheKey);
  if (cached) return { data: cached.data, cache_hit: true };

  const data = await fetchFunction();
  await cache.set(cacheKey, { data }, ttl);
  return { data, cache_hit: false };
}
