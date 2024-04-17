import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { TypeORMError } from 'typeorm';
import { Response } from 'express';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: TypeORMError, host: ArgumentsHost) {
    this.logger.error('got error when trying to connect to DB.', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorMessage: exception.message,
      errorCode: (exception as any).code,
    });
  }
}
