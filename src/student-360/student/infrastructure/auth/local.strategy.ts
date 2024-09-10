import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StudentCredentialsChecker } from '#/student-360/student/infrastructure/service/student-credentials-checker.service';
import { Student } from '#shared/domain/entity/student.entity';
import { StudentInactiveException } from '#shared/domain/exception/student-360/student-inactive.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'student') {
  constructor(private readonly credentialsChecker: StudentCredentialsChecker) {
    super();
  }

  async validate(username: string, password: string): Promise<Student> {
    const student = await this.credentialsChecker.checkCredentials(
      username,
      password,
    );

    if (!student) {
      throw new UnauthorizedException();
    }

    if (!student.isActive) {
      throw new StudentInactiveException();
    }

    return student;
  }
}
