import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SubjectCallPassedEvent } from '#student/domain/event/subject-call/subject-call-passed.event';
import { PromoteStudentHandler } from '#student/application/administrative-group/promote-student/promote-student.handler';
import { PromoteStudentCommand } from '#student/application/administrative-group/promote-student/promote-student.command';

@Injectable()
export class SubjectCallPassedListener {
  constructor(private promoteStudentHandler: PromoteStudentHandler) {}

  @OnEvent('subject-call-passed')
  async handleSubjectCallPassedEvent(payload: SubjectCallPassedEvent) {
    await this.promoteStudentHandler.handle(
      new PromoteStudentCommand(
        payload.academicRecord.id,
        payload.student.id,
        payload.programBlock,
        payload.adminUser,
      ),
    );
  }
}
