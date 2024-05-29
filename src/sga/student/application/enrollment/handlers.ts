import { GetSubjectsNotEnrolledHandler } from '#student/application/enrollment/get-subjects-not-enrolled/get-subjects-not-enrolled.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { CreateEnrollmentHandler } from '#student/application/enrollment/create-enrollment/create-enrollment.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { CreateEnrollmentTransactionalService } from '#student/infrastructure/service/create-enrollment-transactional-service.service';
import datasource from '#config/ormconfig';
import { GetEnrollmentVisibilityHandler } from '#student/application/enrollment/get-enrollment-visibility/get-enrollment-visibility.handler';
import { GetEnrollmentTypeHandler } from '#student/application/enrollment/get-enrollment-type/get-enrollment-type.handler';
import { EditEnrollmentHandler } from '#student/application/enrollment/edit-enrollment/edit-enrollment.handler';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { GetEnrollmentsByAcademicRecordHandler } from '#student/application/enrollment/get-enrollments-by-academic-record/get-enrollments-by-academic-record.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { DeleteEnrollmentHandler } from '#student/application/enrollment/delete-enrollment/delete-enrollment.handler';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';

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

const editEnrollmentHandler = {
  provide: EditEnrollmentHandler,
  useFactory: (
    repository: EnrollmentRepository,
    enrollmentGetter: EnrollmentGetter,
  ): EditEnrollmentHandler =>
    new EditEnrollmentHandler(repository, enrollmentGetter),
  inject: [EnrollmentRepository, EnrollmentGetter],
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

const deleteEnrollmentHandler = {
  provide: DeleteEnrollmentHandler,
  useFactory: (
    enrollmentGetter: EnrollmentGetter,
    enrollmentRepository: EnrollmentRepository,
    subjectCallRepository: SubjectCallRepository,
  ): DeleteEnrollmentHandler =>
    new DeleteEnrollmentHandler(
      enrollmentGetter,
      enrollmentRepository,
      subjectCallRepository,
    ),
  inject: [EnrollmentGetter, EnrollmentRepository, SubjectCallRepository],
};

export const enrollmentHandlers = [
  getSubjectsNotEnrolledHandler,
  createEnrollmentHandler,
  GetEnrollmentVisibilityHandler,
  GetEnrollmentTypeHandler,
  editEnrollmentHandler,
  getEnrollmentsByAcademicRecord,
  deleteEnrollmentHandler,
];
