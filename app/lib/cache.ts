import { kv } from '@vercel/kv';

const PREFIX = 'oc-courses:html:';

export function cacheSave(key: string, htmlContent: string) {
  return kv.set(PREFIX + key, htmlContent);
}

export function cacheLoad(key: string): Promise<string | null> {
  return kv.get(PREFIX + key);
}

// recup du cache
// return cache
// is cache expired ?
// load data
// save data in cache
