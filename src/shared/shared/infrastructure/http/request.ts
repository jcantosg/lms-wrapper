import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Request } from 'express';
import { Student } from '#shared/domain/entity/student.entity';

export interface AuthRequest extends Request {
  user: AdminUser;
}

export interface StudentAuthRequest extends Request {
  user: Student;
}
