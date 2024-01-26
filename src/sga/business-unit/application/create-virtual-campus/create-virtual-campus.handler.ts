import { CommandHandler } from '#shared/domain/bus/command.handler';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { CreateVirtualCampusCommand } from '#business-unit/application/create-virtual-campus/create-virtual-campus.command';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { VirtualCampusDuplicatedException } from '#shared/domain/exception/business-unit/virtual-campus-duplicated.exception';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit-not-found.exception';

export class CreateVirtualCampusHandler implements CommandHandler {
  constructor(
    private readonly virtualCampusRepository: VirtualCampusRepository,
    private readonly businessGetter: BusinessUnitGetter,
    private readonly adminUserGetter: AdminUserGetter,
  ) {}

  async handle(command: CreateVirtualCampusCommand): Promise<void> {
    const businessUnit = await this.businessGetter.get(command.businessUnitId);
    const adminUser = await this.adminUserGetter.get(command.userId);
    const adminUserBusinessUnits = adminUser.businessUnits.map((bu) => bu.id);

    if (
      (await this.virtualCampusRepository.existsById(command.id)) ||
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

    if (!adminUserBusinessUnits.includes(businessUnit.id)) {
      throw new BusinessUnitNotFoundException();
    }

    const virtualCampus = VirtualCampus.create(
      command.id,
      command.name,
      command.code,
      businessUnit,
      adminUser,
    );
    await this.virtualCampusRepository.save(virtualCampus);
  }
}
