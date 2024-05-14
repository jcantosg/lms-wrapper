import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { GetSubjectsNotEnrolledQuery } from '#student/application/enrollment/get-subjects-not-enrolled/get-subjects-not-enrolled.query';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

export class GetSubjectsNotEnrolledHandler implements QueryHandler {
  constructor(
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly subjectRepository: SubjectRepository,
  ) {}

  async handle(query: GetSubjectsNotEnrolledQuery): Promise<Subject[]> {
    const academicRecord = await this.academicRecordGetter.getByAdminUser(
      query.academicRecordId,
      query.adminUser,
    );

    return await this.subjectRepository.getSubjectsNotEnrolled(academicRecord);
  }
}
