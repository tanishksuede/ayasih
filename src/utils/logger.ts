const isDev = import.meta.env.DEV;
export const logger = {
  log: (...args: unknown[]) => { if (isDev) console.log(...args); },
  warn: (...args: unknown[]) => { if (isDev) console.warn(...args); },
  error: (...args: unknown[]) => {
    if (isDev) console.error(...args);
    else console.error('[AYA Error]', String(args[0] instanceof Error ? args[0].message : args[0]).slice(0, 100));
  },
  debug: (...args: unknown[]) => { if (isDev) console.debug(...args); },
};
export default logger;
