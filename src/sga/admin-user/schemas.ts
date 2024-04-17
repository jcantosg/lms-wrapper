import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';
import { recoveryPasswordTokenSchema } from '#admin-user/infrastructure/config/schema/recovery-password-token.schema';
import { refreshTokenSchema } from '#admin-user/infrastructure/config/schema/refresh-token.schema';

export const adminUserSchemas = [
  adminUserSchema,
  refreshTokenSchema,
  recoveryPasswordTokenSchema,
];
