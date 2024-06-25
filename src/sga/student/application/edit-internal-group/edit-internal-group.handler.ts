import { EditInternalGroupCommand } from './edit-internal-group.command';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';

export class EditInternalGroupHandler implements CommandHandler {
  constructor(
    private readonly internalGroupRepository: InternalGroupRepository,
    private readonly internalGroupGetter: InternalGroupGetter,
  ) {}

  async handle(command: EditInternalGroupCommand) {
    const internalGroup = await this.internalGroupGetter.getByAdminUser(
      command.id,
      command.adminUser,
    );

    internalGroup.update(command.code, command.isDefault);

    await this.internalGroupRepository.save(internalGroup);
  }
}
