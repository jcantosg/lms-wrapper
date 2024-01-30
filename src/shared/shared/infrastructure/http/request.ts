import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: AdminUser;
}
