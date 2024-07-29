import { CommandHandler } from '#shared/domain/bus/command.handler';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { RemoveStudentFromInternalGroupCommand } from '#student/application/remove-student-from-internal-group/remove-student-from-internal-group.command';

export class RemoveStudentFromInternalGroupHandler implements CommandHandler {
  constructor(
    private readonly internalGroupRepository: InternalGroupRepository,
    private readonly internalGroupGetter: InternalGroupGetter,
    private readonly studentGetter: StudentGetter,
  ) {}

  async handle(command: RemoveStudentFromInternalGroupCommand) {
    const internalGroup: InternalGroup =
      await this.internalGroupGetter.getByAdminUser(
        command.internalGroupId,
        command.adminUser,
      );

    const student = await this.studentGetter.get(command.studentId);

    internalGroup.removeStudent(student);
    await this.internalGroupRepository.save(internalGroup);
  }
}
