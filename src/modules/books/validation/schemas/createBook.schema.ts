import * as Joi from 'joi'
import { ICreateBookDTO } from '../../interfaces/dto'

export const createBookSchema: Joi.ObjectSchema<ICreateBookDTO> =
  Joi.object().keys({
    name: Joi.string().min(2).required(),
    description: Joi.string().min(10).required(),
    authors: Joi.array().items(Joi.string().min(2)).optional(),
  })
