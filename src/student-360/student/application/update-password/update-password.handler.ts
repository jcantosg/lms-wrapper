import { CommandHandler } from '#shared/domain/bus/command.handler';
import { UpdatePasswordCommand } from '#admin-user/application/update-password/update-password.command';
import { JwtService } from '@nestjs/jwt';
import { getNow } from '#shared/domain/lib/date';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { StudentRecoveryPasswordTokenRepository } from '#student-360/student/domain/repository/student-recovery-password-token.repository';
import { Student } from '#shared/domain/entity/student.entity';
import { StudentRecoveryPasswordTokenGetter } from '#student-360/student/domain/service/student-recovery-password-token-getter.service';

export class UpdateStudentPasswordHandler implements CommandHandler {
  constructor(
    private readonly studentGetter: StudentGetter,
    private readonly studentRepository: StudentRepository,
    private readonly recoveryPasswordTokenRepository: StudentRecoveryPasswordTokenRepository,
    private readonly recoveryPasswordTokenGetter: StudentRecoveryPasswordTokenGetter,
    private readonly jwtService: JwtService,
    private readonly passwordEncoder: PasswordEncoder,
  ) {}

  async handle(command: UpdatePasswordCommand): Promise<void> {
    const recoveryPasswordToken =
      await this.recoveryPasswordTokenGetter.getByToken(command.token);

    const payload = await this.jwtService.verifyAsync(
      recoveryPasswordToken.token,
    );

    const student: Student = await this.studentGetter.getByEmail(payload.email);

    student.password = await this.passwordEncoder.encodePassword(
      command.newPassword,
    );
    await this.studentRepository.save(student);

    recoveryPasswordToken.expiresAt = getNow();
    await this.recoveryPasswordTokenRepository.save(recoveryPasswordToken);
  }
}
