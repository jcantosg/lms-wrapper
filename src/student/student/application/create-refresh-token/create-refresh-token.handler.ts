import { CommandHandler } from '#shared/domain/bus/command.handler';
import { CreateRefreshTokenCommand } from '#admin-user/application/create-refresh-token/create-refresh-token.command';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { Student } from '#shared/domain/entity/student.entity';
import { StudentRefreshToken } from '#/student/student/domain/entity/refresh-token.entity';
import { StudentRefreshTokenRepository } from '#/student/student/domain/repository/student-refresh-token.repository';

export class CreateRefreshTokenHandler implements CommandHandler {
  constructor(
    private readonly studentGetter: StudentGetter,
    private readonly codeRepository: StudentRefreshTokenRepository,
  ) {}

  async handle(command: CreateRefreshTokenCommand): Promise<void> {
    const student: Student = await this.studentGetter.get(command.userId);

    const refreshToken = StudentRefreshToken.createForUser(
      command.id,
      student,
      command.ttl,
    );

    await this.codeRepository.save(refreshToken);
  }
}
