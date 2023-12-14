import * as Joi from 'joi'
import { ISignInDto } from '../../interfaces/dto'

export const signInSchema: Joi.ObjectSchema<ISignInDto> = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
