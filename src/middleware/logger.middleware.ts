import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../logger/logger.service';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, query: queryParams, baseUrl: path, body, headers } = req;

    this.logger.debug(`req:`, {
      headers,
      queryParams,
      body,
      method,
      path,
    });
    if (next) {
      next();
    }
  }
}
