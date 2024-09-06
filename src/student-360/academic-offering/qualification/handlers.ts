import { GetAcademicRecordQualificationHandler } from '#student-360/academic-offering/qualification/application/get-academic-record-qualification/get-academic-record-qualification.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';

const getAcademicRecordQualification = {
  provide: GetAcademicRecordQualificationHandler,
  useFactory: (
    academicRecordGetter: AcademicRecordGetter,
    enrollmentGetter: EnrollmentGetter,
  ): GetAcademicRecordQualificationHandler =>
    new GetAcademicRecordQualificationHandler(
      academicRecordGetter,
      enrollmentGetter,
    ),
  inject: [AcademicRecordGetter, EnrollmentGetter],
};

export const qualificationHandlers = [getAcademicRecordQualification];
