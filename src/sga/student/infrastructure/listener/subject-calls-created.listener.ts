import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SubjectCallScheduleHistoryRepository } from '#student/domain/repository/subject-call-schedule-history.repository';
import { SubjectCallsCreatedEvent } from '#student/domain/event/subject-call/subject-calls-created.event';
import { SubjectCallScheduleHistory } from '#student/domain/entity/subject-call-schedule-history.entity';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';

@Injectable()
export class SubjectCallsCreatedListener {
  constructor(
    private uuidService: UUIDGeneratorService,
    private subjectCallScheduleHistoryRepository: SubjectCallScheduleHistoryRepository,
  ) {}

  @OnEvent('subject-calls-created')
  async handleSubjectCallsCreatedEvent(payload: SubjectCallsCreatedEvent) {
    await this.subjectCallScheduleHistoryRepository.save(
      SubjectCallScheduleHistory.create(
        this.uuidService.generate(),
        payload.adminUser,
        payload.businessUnit,
        payload.academicPeriod,
        payload.academicPrograms,
      ),
    );
  }
}
