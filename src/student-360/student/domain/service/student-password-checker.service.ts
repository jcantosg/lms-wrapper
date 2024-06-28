import { Student } from '#shared/domain/entity/student.entity';

export abstract class StudentPasswordChecker {
  abstract checkPassword(
    plainTextPassword: string,
    user: Student,
  ): Promise<boolean>;
}
