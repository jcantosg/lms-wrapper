import { LoginStudentController } from '#student-360/student/infrastructure/controller/login-student.controller';
import { GenerateRecoveryPasswordTokenController } from '#student-360/student/infrastructure/controller/generate-recovery-password-token.controller';
import { RefreshTokenStudentController } from '#student-360/student/infrastructure/controller/refresh-token-student.controller';
import { UpdateStudentPasswordController } from '#student-360/student/infrastructure/controller/update-student-password.controller';
import { GetStudentAcademicRecordsController } from '#student-360/academic-offering/academic-record/infrastructure/controller/get-student-academic-records/get-student-academic-records.controller';
import { GetStudentAcademicRecordController } from '#student-360/academic-offering/academic-record/infrastructure/controller/get-student-academic-record/get-student-academic-record.controller';
import { LogoutStudentController } from '#student-360/student/infrastructure/controller/logout-student.controller';
import { StudentMeController } from '#student-360/student/infrastructure/controller/me/student-me.controller';
import { UpdateProfileController } from '#student-360/student/infrastructure/controller/update-profile.controller';

export const studentAuthControllers = [
  LoginStudentController,
  GenerateRecoveryPasswordTokenController,
  UpdateStudentPasswordController,
  RefreshTokenStudentController,
  GetStudentAcademicRecordsController,
  GetStudentAcademicRecordController,
  LogoutStudentController,
  StudentMeController,
  UpdateProfileController,
];
