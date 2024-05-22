import { StudentPasswordChecker } from '#/student/student/domain/service/student-password-checker.service';
import { Student } from '#shared/domain/entity/student.entity';
import { compare } from 'bcrypt';

export class BcryptStudentPasswordChecker implements StudentPasswordChecker {
  async checkPassword(
    plainTextPassword: string,
    user: Student,
  ): Promise<boolean> {
    return await compare(plainTextPassword, user.password!);
  }
}
