import { LogLevel } from '@nestjs/common';

export type AppLogLevel = 0 | 1 | 2 | 3 | 4;
export const AppLogLevel = {
  error: 0,
  warn: 1,
  log: 2,
  debug: 3,
  verbose: 4,
} as const satisfies Record<LogLevel, AppLogLevel>;

export const fromString = (logLevel: string): AppLogLevel =>
  AppLogLevel[logLevel] ?? AppLogLevel.verbose;
