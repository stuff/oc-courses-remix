import { cacheLoad, cacheSave } from '~/lib/cache';

export async function retrieveCachedHtmlContent(
  cacheKey: string,
  getFetcher: () => Promise<string>,
  options: {
    force?: boolean;
    htmlProcessFunction: (html: string) => Promise<string>;
  } = {
    htmlProcessFunction: (html: string) => Promise.resolve(html),
  }
): Promise<string> {
  console.time('retrieveCachedHtmlContent');

  // console.log(typeof process.env.NEXT_PUBLIC_HTML_REDIS_CACHE_DISABLED);
  let returnContent: string | null;

  // if (process.env.NEXT_PUBLIC_HTML_REDIS_CACHE_DISABLED === 'true') {
  //   console.log('force cache reload for', cacheKey);
  const htmlContent = await getFetcher();
  returnContent = await options.htmlProcessFunction(htmlContent);
  // } else {
  //   returnContent = await cacheLoad(cacheKey);
  //   if (!returnContent) {
  //     console.log('cache miss for', cacheKey);
  //     const htmlContent = await getFetcher();
  //     returnContent = await options.htmlProcessFunction(htmlContent);
  //     cacheSave(cacheKey, returnContent);
  //   }
  // }

  console.timeEnd('retrieveCachedHtmlContent');

  return returnContent;
}
