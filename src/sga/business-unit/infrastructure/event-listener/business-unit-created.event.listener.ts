import { Injectable } from '@nestjs/common';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { OnEvent } from '@nestjs/event-emitter';
import { BusinessUnitCreatedEvent } from '#business-unit/domain/event/business-unit-created.event';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

@Injectable()
export class BusinessUnitCreatedEventListener {
  constructor(
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly userRepository: AdminUserRepository,
  ) {}

  @OnEvent('business-unit.created')
  async handleBusinessUnitEvent(event: BusinessUnitCreatedEvent) {
    const businessUnit = await this.businessUnitGetter.get(
      event.businessUnitId,
    );

    const superAdminUsers = await this.userRepository.getByRole(
      AdminUserRoles.SUPERADMIN,
    );
    for (const superAdminUser of superAdminUsers) {
      superAdminUser.addBusinessUnit(businessUnit);
      await this.userRepository.save(superAdminUser);
    }
  }
}
