import { useAdapter } from '@type-cacheable/cache-manager-adapter';
import cache from './default';

// biome-ignore lint/correctness/useHookAtTopLevel: This is not a hook
export const c = useAdapter(cache);

export {
  Cacheable,
  CacheClear,
  default as cacheManager,
} from '@type-cacheable/core';
export * as defaultCache from './default';
