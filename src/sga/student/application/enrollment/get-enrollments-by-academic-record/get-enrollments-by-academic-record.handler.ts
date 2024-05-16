import { QueryHandler } from '#shared/domain/bus/query.handler';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { GetEnrollmentsByAcademicRecordQuery } from '#student/application/enrollment/get-enrollments-by-academic-record/get-enrollments-by-academic-record.query';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { GetEnrollmentsByAcademicRecordCriteria } from '#student/application/enrollment/get-enrollments-by-academic-record/get-enrollments-by-academic-record.criteria';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';

export class GetEnrollmentsByAcademicRecordHandler implements QueryHandler {
  constructor(
    private readonly repository: EnrollmentRepository,
    private readonly academicRecordRepository: AcademicRecordRepository,
  ) {}

  async handle(
    query: GetEnrollmentsByAcademicRecordQuery,
  ): Promise<Enrollment[]> {
    if (
      !(await this.academicRecordRepository.existsById(query.academicRecordId))
    ) {
      throw new AcademicRecordNotFoundException();
    }
    const criteria = new GetEnrollmentsByAcademicRecordCriteria(query);

    return await this.repository.matching(criteria);
  }
}
