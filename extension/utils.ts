import Consola, { LogLevels } from 'consola/basic';

export const logger = Consola.withTag('OI Runner++');
logger.options.level = process.env.NODE_ENV === 'development' ? LogLevels.debug : LogLevels.info;

/**
 * Cache the result of a function.
 * @param fn The function. Must have no arguments.
 * @returns A function that calls {@link fn} and caches the result for future calls.
 */
export function cachedFn<T>(fn: () => T): () => T {
  let cache: T | undefined;
  return () => {
    if (!cache)
      cache = fn();
    return cache;
  };
}
