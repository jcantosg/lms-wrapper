import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { studentSchema } from '#shared/infrastructure/config/schema/student.schema';
import { refreshTokenSchema } from '#admin-user/infrastructure/config/schema/refresh-token.schema';
import { recoveryPasswordTokenSchema } from '#admin-user/infrastructure/config/schema/recovery-password-token.schema';

export const sharedSchemas = [
  CountrySchema,
  studentSchema,
  refreshTokenSchema,
  recoveryPasswordTokenSchema,
];
