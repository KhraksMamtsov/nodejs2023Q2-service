import { LoggerService, LogLevel } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export class FileLoggerTransport implements LoggerService {
  private static readonly EXTENSION = '.txt';
  constructor(
    private readonly directory: string,
    private readonly fileSize: number,
  ) {}

  error(message: string) {
    return this.write('error', message);
  }

  warn(message: string) {
    return this.write('warn', message);
  }

  log(message: string) {
    return this.write('log', message);
  }

  debug(message: string) {
    return this.write('debug', message);
  }

  verbose(message: string) {
    return this.write('verbose', message);
  }

  private async write(level: LogLevel, message: string) {
    try {
      const logFile = await this.getLatestFileFor(level);
      await fs.appendFile(logFile, message + '\n');
    } catch (e) {
      console.error(e, 'Error during log to file');
    }
  }

  private async getLatestFileFor(logLevel: LogLevel) {
    const files = await this.getLogFilesFor(logLevel);

    if (files.length === 0) {
      return this.getNameFor(logLevel, 0);
    }

    const latestFileIndex = Math.max(
      ...files.map((x) => Number(x.split('.')[1])),
    );

    const latestFile = this.getNameFor(logLevel, latestFileIndex);

    try {
      const stats = await fs.stat(latestFile);

      if (stats.size >= this.fileSize) {
        const nextFile = this.getNameFor(logLevel, latestFileIndex + 1);
        await fs.writeFile(nextFile, '');
        return nextFile;
      } else {
        return latestFile;
      }
    } catch (error) {
      await fs.writeFile(latestFile, '');
      return latestFile;
    }
  }

  private async getLogFilesFor(logLevel: string) {
    try {
      await fs.stat(this.directory);
    } catch (error) {
      try {
        await fs.mkdir(this.directory);
      } catch {}
    }

    const logFiles = await fs.readdir(this.directory);

    return logFiles.filter((x) => x.includes(logLevel));
  }

  private getNameFor(logLevel: string, index: number): string {
    return path.join(
      this.directory,
      `${logLevel}.${index}${FileLoggerTransport.EXTENSION}`,
    );
  }
}
