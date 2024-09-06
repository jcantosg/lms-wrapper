import { ApplicationEvent } from '#shared/domain/event/application.event';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class SubjectCallsCreatedEvent implements ApplicationEvent {
  name: string = 'subject-calls-created';

  constructor(
    readonly businessUnit: BusinessUnit,
    readonly academicPeriod: AcademicPeriod,
    readonly academicPrograms: AcademicProgram[],
    readonly adminUser: AdminUser,
  ) {}
}
