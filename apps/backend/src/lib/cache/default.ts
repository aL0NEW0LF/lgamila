import { createCache, memoryStore } from "cache-manager";

const cache = createCache(
  memoryStore({
    max: 1000,
    ttl: 60 * 1000 /*milliseconds*/,
  }),
);

export default cache;
