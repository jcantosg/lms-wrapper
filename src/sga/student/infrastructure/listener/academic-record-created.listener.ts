import { Injectable } from '@nestjs/common';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { AcademicRecordCreatedEvent } from '#student/domain/event/academic-record/academic-record-created.event';

@Injectable()
export class AcademicRecordCreatedListener {
  constructor(
    private administrativeGroupRepository: AdministrativeGroupRepository,
  ) {}

  @OnEvent('academic-record-created')
  async handleAcademicRecordCreatedEvent(payload: AcademicRecordCreatedEvent) {
    const administrativeGroup = payload.administrativeGroup;

    administrativeGroup.addStudent(payload.student);

    await this.administrativeGroupRepository.save(administrativeGroup);
  }
}
