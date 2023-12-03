import * as Joi from 'joi'
import { IUpdateBookDTO } from '../../interfaces/dto'

export const updateBookSchema: Joi.ObjectSchema<IUpdateBookDTO> =
  Joi.object().keys({
    name: Joi.string().min(2).optional(),
    description: Joi.string().min(10).optional(),
    authors: Joi.array().items(Joi.string().min(2)).optional(),
  })
