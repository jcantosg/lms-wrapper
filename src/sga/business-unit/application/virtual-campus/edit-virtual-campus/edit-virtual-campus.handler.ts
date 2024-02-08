import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { EditVirtualCampusCommand } from '#business-unit/application/virtual-campus/edit-virtual-campus/edit-virtual-campus.command';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { VirtualCampusDuplicatedException } from '#shared/domain/exception/business-unit/virtual-campus-duplicated.exception';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit-not-found.exception';

export class EditVirtualCampusHandler implements CommandHandler {
  constructor(
    private readonly virtualCampusRepository: VirtualCampusRepository,
    private readonly virtualCampusGetter: VirtualCampusGetter,
  ) {}

  async handle(command: EditVirtualCampusCommand): Promise<void> {
    if (
      (await this.virtualCampusRepository.existsByName(
        command.id,
        command.name,
      )) ||
      (await this.virtualCampusRepository.existsByCode(
        command.id,
        command.code,
      ))
    ) {
      throw new VirtualCampusDuplicatedException();
    }
    const virtualCampus = await this.virtualCampusGetter.get(command.id);
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );

    if (!adminUserBusinessUnits.includes(virtualCampus.businessUnit.id)) {
      throw new BusinessUnitNotFoundException();
    }

    virtualCampus.update(
      command.name,
      command.code,
      command.user,
      command.isActive,
    );

    await this.virtualCampusRepository.update(virtualCampus);
  }
}
