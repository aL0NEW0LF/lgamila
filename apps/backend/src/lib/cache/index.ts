import cache from "./default";
import { useAdapter } from "@type-cacheable/cache-manager-adapter";
import cacheManager, { Cacheable, CacheClear } from "@type-cacheable/core";

export const cacheClient = useAdapter(cache);
export * as defaultCache from "./default";
export { Cacheable, CacheClear, cacheManager };
