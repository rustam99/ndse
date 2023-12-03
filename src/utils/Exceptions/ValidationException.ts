import { HttpException, HttpStatus } from '@nestjs/common'
import Joi from 'joi'

export class ValidationException extends HttpException {
  constructor(error: Joi.ValidationError) {
    super(
      {
        error: error.name,
        fields: error.details,
      },
      HttpStatus.BAD_REQUEST,
      { cause: error },
    )
  }
}
