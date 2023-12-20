import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import * as Joi from 'joi';

export const loginAdminUserSchema: Joi.ObjectSchema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp(AdminUser.passwordPattern))
    .required(),
});
