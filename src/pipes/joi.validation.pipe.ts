import { PipeTransform, Injectable } from '@nestjs/common'
import { ObjectSchema } from 'joi'
import { ValidationException } from '../utils/Exceptions/ValidationException'

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: unknown) {
    const { error } = this.schema.validate(value, {
      abortEarly: false,
    })

    if (error) {
      throw new ValidationException(error)
    }

    return value
  }
}
