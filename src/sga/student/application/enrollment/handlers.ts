import { GetSubjectsNotEnrolledHandler } from '#student/application/enrollment/get-subjects-not-enrolled/get-subjects-not-enrolled.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { CreateEnrollmentHandler } from '#student/application/enrollment/create-enrollment/create-enrollment.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { CreateEnrollmentTransactionalService } from '#student/infrastructure/service/create-enrollment-transactional-service.service';
import datasource from '#config/ormconfig';
import { GetEnrollmentsByAcademicRecordHandler } from '#student/application/enrollment/get-enrollments-by-academic-record/get-enrollments-by-academic-record.handler';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';

const getSubjectsNotEnrolledHandler = {
  provide: GetSubjectsNotEnrolledHandler,
  useFactory: (
    academicRecordGetter: AcademicRecordGetter,
    subjectRepository: SubjectRepository,
  ): GetSubjectsNotEnrolledHandler =>
    new GetSubjectsNotEnrolledHandler(academicRecordGetter, subjectRepository),
  inject: [AcademicRecordGetter, SubjectRepository],
};

const createEnrollmentHandler = {
  provide: CreateEnrollmentHandler,
  useFactory: (
    academicRecordGetter: AcademicRecordGetter,
    subjectGetter: SubjectGetter,
  ) => {
    const transactionalService = new CreateEnrollmentTransactionalService(
      datasource,
    );

    return new CreateEnrollmentHandler(
      academicRecordGetter,
      subjectGetter,
      transactionalService,
    );
  },
  inject: [AcademicRecordGetter, SubjectGetter],
};

const getEnrollmentsByAcademicRecord = {
  provide: GetEnrollmentsByAcademicRecordHandler,
  useFactory: (
    repository: EnrollmentRepository,
    academicRecordRepository: AcademicRecordRepository,
  ): GetEnrollmentsByAcademicRecordHandler =>
    new GetEnrollmentsByAcademicRecordHandler(
      repository,
      academicRecordRepository,
    ),
  inject: [EnrollmentRepository, AcademicRecordRepository],
};

export const enrollmentHandlers = [
  getSubjectsNotEnrolledHandler,
  createEnrollmentHandler,
  getEnrollmentsByAcademicRecord,
];
