import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import * as Joi from 'joi';

export const registerAdminUserSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().guid(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp(AdminUser.passwordPattern))
    .required(),
  roles: Joi.array()
    .items(Joi.string().valid(...Object.values(AdminUserRoles)))
    .required(),
  name: Joi.string().required(),
  avatar: Joi.string(),
});
