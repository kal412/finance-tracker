import { HttpException, HttpStatus } from '@nestjs/common';
import { StatusCodesList } from 'src/common/constants/status-codes-list.constants';

export class CustomHttpException extends HttpException {
  constructor(message?: string, statusCode?: number, code?: number) {
    super(
      {
        message: message || 'Bad Request',
        code: code || StatusCodesList.BadRequest,
        statusCode: statusCode || HttpStatus.BAD_REQUEST,
        error: true,
      },
      statusCode || HttpStatus.BAD_REQUEST,
    );
  }
}
