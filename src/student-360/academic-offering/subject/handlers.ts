import { GetSubjectHandler } from '#/student-360/academic-offering/subject/application/get-subject/get-subject.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { InternalGroupDefaultTeacherGetter } from '#student/domain/service/internal-group-default-teacher-getter.service';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';

export const getSubjectHandler = {
  provide: GetSubjectHandler,
  useFactory: (
    subjectGetter: SubjectGetter,
    internalGroupDefaultTeacherGetter: InternalGroupDefaultTeacherGetter,
    academicRecordRepository: AcademicRecordRepository,
  ): GetSubjectHandler =>
    new GetSubjectHandler(
      subjectGetter,
      internalGroupDefaultTeacherGetter,
      academicRecordRepository,
    ),
  inject: [
    SubjectGetter,
    InternalGroupDefaultTeacherGetter,
    AcademicRecordRepository,
  ],
};

export const studentSubjectHandlers = [getSubjectHandler];
