import { ApplicationEvent } from '#shared/domain/event/application.event';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class AcademicPeriodCreatedEvent implements ApplicationEvent {
  name: string = 'academic-period-created';

  constructor(
    readonly academicPeriodId: string,
    readonly academicPeriodBusinessUnit: string,
    readonly adminUser: AdminUser,
  ) {}
}
