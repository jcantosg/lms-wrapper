import { Injectable } from '@nestjs/common';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { OnEvent } from '@nestjs/event-emitter';
import { BusinessUnitCreatedEvent } from '#business-unit/domain/event/business-unit-created.event';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { Order } from '#/sga/shared/domain/criteria/order';

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
    const filters = [
      new Filter(
        'roles',
        AdminUserRoles.SUPERADMIN,
        FilterOperators.ANY,
        GroupOperator.AND,
      ),
    ];
    const criteria = new Criteria(filters, new Order('created_at'), 0, 0);

    const superAdminUsers = await this.userRepository.matching(criteria);
    for (const superAdminUser of superAdminUsers) {
      superAdminUser.addBusinessUnit(businessUnit);
      await this.userRepository.save(superAdminUser);
    }
  }
}
