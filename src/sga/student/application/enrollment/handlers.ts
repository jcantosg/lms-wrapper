import { GetSubjectsNotEnrolledHandler } from '#student/application/enrollment/get-subjects-not-enrolled/get-subjects-not-enrolled.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { CreateEnrollmentHandler } from '#student/application/enrollment/create-enrollment/create-enrollment.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { CreateEnrollmentTransactionalService } from '#student/infrastructure/service/create-enrollment-transactional-service.service';
import datasource from '#config/ormconfig';

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

export const enrollmentHandlers = [
  getSubjectsNotEnrolledHandler,
  createEnrollmentHandler,
];
