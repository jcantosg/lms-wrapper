import { ApplicationEvent } from '#shared/domain/event/application.event';
import { Student } from '#shared/domain/entity/student.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

export class SubjectCallPassedEvent implements ApplicationEvent {
  name: string = 'subject-call-passed';

  constructor(
    readonly programBlock: ProgramBlock,
    readonly academicRecord: AcademicRecord,
    readonly student: Student,
  ) {}
}
