import { LoginStudentController } from '#/student/student/infrastructure/controller/login-student.controller';
import { GenerateRecoveryPasswordTokenController } from '#/student/student/infrastructure/controller/generate-recovery-password-token.controller';
import { RefreshTokenStudentController } from '#/student/student/infrastructure/controller/refresh-token-student.controller';
import { UpdateStudentPasswordController } from '#/student/student/infrastructure/controller/update-student-password.controller';

export const studentControllers = [
  LoginStudentController,
  GenerateRecoveryPasswordTokenController,
  UpdateStudentPasswordController,
  RefreshTokenStudentController,
];
