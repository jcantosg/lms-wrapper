import { LoginStudentController } from '#/student/student/infrastructure/controller/login-student.controller';
import { RefreshTokenStudentController } from '#/student/student/infrastructure/controller/refresh-token-student.controller';

export const studentControllers = [
  LoginStudentController,
  RefreshTokenStudentController,
];
