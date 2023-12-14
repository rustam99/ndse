import * as Joi from 'joi'
import { ISignUpDto } from '../../interfaces/dto'

export const signUpSchema: Joi.ObjectSchema<ISignUpDto> = Joi.object().keys({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
