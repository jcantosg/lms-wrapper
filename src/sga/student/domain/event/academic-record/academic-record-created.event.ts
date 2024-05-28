import { ApplicationEvent } from '#shared/domain/event/application.event';
import { Student } from '#shared/domain/entity/student.entity';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';

export class AcademicRecordCreatedEvent implements ApplicationEvent {
  name: string = 'academic-record-created';

  constructor(
    readonly administrativeGroup: AdministrativeGroup,
    readonly student: Student,
  ) {}
}
