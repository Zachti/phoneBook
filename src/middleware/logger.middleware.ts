import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PhoneBookModule } from '../app.module';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(PhoneBookModule.name);
  use(req: Request, res: Response, next: NextFunction) {
    const { method, query: queryParams, baseUrl: path, body } = req;

    this.logger.debug(`new request`, {
      queryParams,
      body,
      method,
      path,
      timestamp: new Date().toDateString(),
    });
    if (next) {
      next();
    }
  }
}
