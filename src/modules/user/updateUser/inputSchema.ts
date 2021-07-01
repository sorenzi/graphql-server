import * as Joi from 'joi';

export const schema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
  first_name: Joi.string().max(255),
  last_name: Joi.string().max(255)
});
