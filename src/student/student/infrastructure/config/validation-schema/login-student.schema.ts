import * as Joi from 'joi';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export const loginStudentSchema: Joi.ObjectSchema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp(AdminUser.passwordPattern))
    .required(),
});
