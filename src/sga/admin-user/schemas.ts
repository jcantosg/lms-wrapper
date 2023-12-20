import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';
import { refreshTokenSchema } from '#admin-user/infrastructure/config/schema/refresh-token.schema';

export const adminUserSchemas = [adminUserSchema, refreshTokenSchema];
