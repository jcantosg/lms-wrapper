import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { StudentPasswordChecker } from '#/student-360/student/domain/service/student-password-checker.service';
import { Student } from '#shared/domain/entity/student.entity';

@Injectable()
export class StudentCredentialsChecker {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly passwordChecker: StudentPasswordChecker,
  ) {}

  public async checkCredentials(
    username: string,
    password: string,
  ): Promise<Student | void> {
    const student = await this.studentRepository.getByEmail(username);
    if (student) {
      if (!(await this.passwordChecker.checkPassword(password, student))) {
        throw new UnauthorizedException();
      }

      return student;
    }
  }
}
