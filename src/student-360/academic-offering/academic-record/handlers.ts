import { GetStudentAcademicRecordsHandler } from '#student-360/academic-offering/academic-record/application/get-student-academic-records/get-student-academic-records.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { GetStudentAcademicRecordHandler } from '#student-360/academic-offering/academic-record/application/get-student-academic-record/get-student-academic-record.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { GetLmsCourseProgressHandler } from '#lms-wrapper/application/lms-course/get-lms-course-progress/get-lms-course-progress.handler';
import { InternalGroupDefaultTeacherGetter } from '#student/domain/service/internal-group-default-teacher-getter.service';

const getStudentAcademicRecordsHandler = {
  provide: GetStudentAcademicRecordsHandler,
  useFactory: (
    repository: AcademicRecordRepository,
  ): GetStudentAcademicRecordsHandler =>
    new GetStudentAcademicRecordsHandler(repository),
  inject: [AcademicRecordRepository],
};

const getAcademicRecordHandler = {
  provide: GetStudentAcademicRecordHandler,
  useFactory: (
    academicRecordGetter: AcademicRecordGetter,
    getLmsCourseProgressHandler: GetLmsCourseProgressHandler,
    internalGroupTeacherGetter: InternalGroupDefaultTeacherGetter,
  ): GetStudentAcademicRecordHandler =>
    new GetStudentAcademicRecordHandler(
      academicRecordGetter,
      getLmsCourseProgressHandler,
      internalGroupTeacherGetter,
    ),
  inject: [
    AcademicRecordGetter,
    GetLmsCourseProgressHandler,
    InternalGroupDefaultTeacherGetter,
  ],
};

export const studentAcademicRecordHandlers = [
  getStudentAcademicRecordsHandler,
  getAcademicRecordHandler,
];
