import { LoginStudentController } from '#/student/student/infrastructure/controller/login-student.controller';
import { GenerateRecoveryPasswordTokenController } from '#/student/student/infrastructure/controller/generate-recovery-password-token.controller';
import { RefreshTokenStudentController } from '#/student/student/infrastructure/controller/refresh-token-student.controller';
import { UpdateStudentPasswordController } from '#/student/student/infrastructure/controller/update-student-password.controller';
import { GetStudentAcademicRecordsController } from '#/student/academic-offering/academic-record/infrastructure/controller/get-student-academic-records/get-student-academic-records.controller';
import { GetStudentAcademicRecordController } from '#/student/academic-offering/academic-record/infrastructure/controller/get-student-academic-record/get-student-academic-record.controller';
import { LogoutStudentController } from '#/student/student/infrastructure/controller/logout-student.controller';

export const studentControllers = [
  LoginStudentController,
  GenerateRecoveryPasswordTokenController,
  UpdateStudentPasswordController,
  RefreshTokenStudentController,
  GetStudentAcademicRecordsController,
  GetStudentAcademicRecordController,
  LogoutStudentController,
];
