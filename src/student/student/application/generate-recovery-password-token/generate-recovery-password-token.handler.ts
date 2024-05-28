import { CommandHandler } from '#shared/domain/bus/command.handler';
import { StudentRecoveryPasswordTokenRepository } from '#/student/student/domain/repository/student-recovery-password-token.repository';
import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { GenerateRecoveryPasswordTokenCommand } from '#/student/student/application/generate-recovery-password-token/generate-recovery-password-token.command';
import { StudentRecoveryPasswordToken } from '#/student/student/domain/entity/student-recovery-password-token.entity';
import { v4 as uuid } from 'uuid';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { RecoveryPasswordTokenGeneratedEvent } from '#/student/student/domain/event/recovery-password-token-generated.event';
import { StudentRepository } from '#/student/student/domain/repository/student.repository';

export class GenerateRecoveryPasswordTokenHandler implements CommandHandler {
  constructor(
    private readonly repository: StudentRepository,
    private readonly recoveryPasswordTokenRepository: StudentRecoveryPasswordTokenRepository,
    private readonly jwtTokenGenerator: JwtTokenGenerator,
    private readonly ttl: number,
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  async handle(command: GenerateRecoveryPasswordTokenCommand): Promise<void> {
    const student = await this.repository.getByEmail(command.universaeEmail);
    if (!student) {
      return;
    }
    const token = this.jwtTokenGenerator.generateToken(
      student.id,
      student.universaeEmail,
    );
    const recoveryPasswordToken = StudentRecoveryPasswordToken.create(
      uuid(),
      this.ttl,
      token,
      student,
    );
    await this.recoveryPasswordTokenRepository.save(recoveryPasswordToken);

    await this.eventDispatcher.dispatch(
      new RecoveryPasswordTokenGeneratedEvent(
        student.name,
        student.universaeEmail,
        token,
      ),
    );
  }
}
