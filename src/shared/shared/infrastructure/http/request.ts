import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Request } from 'express';

export type UserRequest = {
  id: string;
  email: string;
  roles: AdminUserRoles[];
  businessUnits: string[];
};

export interface AuthRequest extends Request {
  user: UserRequest;
}
