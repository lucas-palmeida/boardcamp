import Joi from 'joi';

export const customerSchema = Joi.object({
    name: Joi.string().min(3).max(30).trim().required(),
    phone: Joi.string().pattern(/^[0-9]+$/, 'phone').min(10).max(11).required(),
    cpf: Joi.string().pattern(/^[0-9]{11}$/, 'cpf').required(),
    birthday: Joi.date().utc().greater('1907-01-01').less('now').required()
})