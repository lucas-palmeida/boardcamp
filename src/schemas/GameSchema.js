import Joi from 'joi';

export const gameSchema = Joi.object({
    name: Joi.string().min(3).max(30).trim().required(),
    image: Joi.string().uri().min(3).trim().required(),
    stockTotal: Joi.number().integer().positive().required(),
    pricePerDay: Joi.number().positive().required()
})