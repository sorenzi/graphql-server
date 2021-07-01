import * as Joi from 'joi';
import { UserRoles } from '../constants';

export const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid(...UserRoles)
    .required(),
  first_name: Joi.string().max(255),
  last_name: Joi.string().max(255)
});
