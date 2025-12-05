/**
 * Application Logger
 *
 * Centralized logging utility that:
 * - Respects ESLint rules (no console warnings)
 * - Can be disabled in production
 * - Provides consistent log formatting
 * - Supports different log levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
  prefix?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const isDev = process.env.NODE_ENV === 'development';

const defaultConfig: LoggerConfig = {
  enabled: isDev,
  minLevel: isDev ? 'debug' : 'warn',
};

function shouldLog(level: LogLevel, config: LoggerConfig): boolean {
  if (!config.enabled) return false;
  return LOG_LEVELS[level] >= LOG_LEVELS[config.minLevel];
}

function formatMessage(prefix: string | undefined, ...args: unknown[]): unknown[] {
  if (prefix) {
    return [`[${prefix}]`, ...args];
  }
  return args;
}

function createLogger(config: Partial<LoggerConfig> = {}) {
  const mergedConfig: LoggerConfig = { ...defaultConfig, ...config };

  return {
    debug: (...args: unknown[]) => {
      if (shouldLog('debug', mergedConfig)) {
        // eslint-disable-next-line no-console
        console.debug(...formatMessage(mergedConfig.prefix, ...args));
      }
    },

    info: (...args: unknown[]) => {
      if (shouldLog('info', mergedConfig)) {
        // eslint-disable-next-line no-console
        console.info(...formatMessage(mergedConfig.prefix, ...args));
      }
    },

    log: (...args: unknown[]) => {
      if (shouldLog('info', mergedConfig)) {
        // eslint-disable-next-line no-console
        console.log(...formatMessage(mergedConfig.prefix, ...args));
      }
    },

    warn: (...args: unknown[]) => {
      if (shouldLog('warn', mergedConfig)) {
        // eslint-disable-next-line no-console
        console.warn(...formatMessage(mergedConfig.prefix, ...args));
      }
    },

    error: (...args: unknown[]) => {
      if (shouldLog('error', mergedConfig)) {
        // eslint-disable-next-line no-console
        console.error(...formatMessage(mergedConfig.prefix, ...args));
      }
    },

    // Create a child logger with a specific prefix
    child: (prefix: string) => createLogger({ ...mergedConfig, prefix }),
  };
}

// Default app logger
export const logger = createLogger();

// Pre-configured loggers for specific areas
export const adminLogger = createLogger({ prefix: 'Admin' });
export const apiLogger = createLogger({ prefix: 'API' });
export const seedLogger = createLogger({ prefix: 'Seed', enabled: true, minLevel: 'debug' });

export default logger;
