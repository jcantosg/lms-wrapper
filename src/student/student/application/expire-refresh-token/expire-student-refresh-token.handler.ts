import { CommandHandler } from '#shared/domain/bus/command.handler';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { StudentRefreshTokenRepository } from '#/student/student/domain/repository/student-refresh-token.repository';
import { ExpireStudentRefreshTokenCommand } from '#/student/student/application/expire-refresh-token/expire-student-refresh-token.command';

export class ExpireStudentRefreshTokenHandler implements CommandHandler {
  constructor(
    private readonly studentGetter: StudentGetter,
    private readonly refreshTokenRepository: StudentRefreshTokenRepository,
  ) {}

  async handle(command: ExpireStudentRefreshTokenCommand): Promise<void> {
    const student = await this.studentGetter.get(command.studentId);
    await this.refreshTokenRepository.expiresAll(student);
  }
}
