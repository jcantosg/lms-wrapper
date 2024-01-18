import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { EditVirtualCampusCommand } from '#business-unit/application/edit-virtual-campus/edit-virtual-campus.command';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { VirtualCampusDuplicatedException } from '#shared/domain/exception/business-unit/virtual-campus-duplicated.exception';

export class EditVirtualCampusHandler implements CommandHandler {
  constructor(
    private readonly virtualCampusRepository: VirtualCampusRepository,
    private readonly virtualCampusGetter: VirtualCampusGetter,
    private readonly adminUserGetter: AdminUserGetter,
  ) {}

  async handle(command: EditVirtualCampusCommand): Promise<void> {
    if (
      (await this.virtualCampusRepository.existsByName(
        command.id,
        command.name,
      )) ||
      (await this.virtualCampusRepository.existsByCode(
        command.id,
        command.name,
      ))
    ) {
      throw new VirtualCampusDuplicatedException();
    }
    const virtualCampus = await this.virtualCampusGetter.get(command.id);
    const user = await this.adminUserGetter.get(command.userId);

    virtualCampus.update(command.name, command.code, user, command.isActive);

    await this.virtualCampusRepository.update(virtualCampus);
  }
}
