import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StudentCredentialsChecker } from '#/student-360/student/infrastructure/service/student-credentials-checker.service';
import { Student } from '#shared/domain/entity/student.entity';

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

    return student;
  }
}
