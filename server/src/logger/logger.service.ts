import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  private static lastTimestamp?: number;

  constructor(context?: string) {
    super(context ?? 'App');
    this.setLogLevels(['log', 'error', 'warn', 'debug', 'verbose']);
  }

  protected formatPid(pid: number): string {
    return `[BN:${pid}]`;
  }

  protected getTimestamp(): string {
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').replace('Z', '');

    if (LoggerService.lastTimestamp) {
      const diff = now.getTime() - LoggerService.lastTimestamp;
      LoggerService.lastTimestamp = now.getTime();
      return `${formatted} +${diff}ms`;
    }

    LoggerService.lastTimestamp = now.getTime();
    return formatted;
  }

  debug(message: any, context?: string): void {
    super.debug(`\x1b[36m[D] ${message}\x1b[0m`, context ?? this.context);
  }

  log(message: any, context?: string): void {
    super.log(`\x1b[32m${message}\x1b[0m`, context ?? this.context);
  }

  warn(message: any, context?: string): void {
    super.warn(`\x1b[33m${message}\x1b[0m`, context ?? this.context);
  }

  error(message: any, trace?: string, context?: string): void {
    super.error(`\x1b[31m${message}\x1b[0m`, trace, context ?? this.context);
  }
}
