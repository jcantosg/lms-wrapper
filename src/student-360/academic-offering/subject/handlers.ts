import { GetSubjectHandler } from '#/student-360/academic-offering/subject/application/get-subject/get-subject.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { InternalGroupDefaultTeacherGetter } from '#student/domain/service/internal-group-default-teacher-getter.service';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { GetSubjectProgressHandler } from '#student-360/academic-offering/subject/application/get-subject-progress/get-subject-progress.handler';
import { GetLmsCourseProgressHandler } from '#/lms-wrapper/application/lms-course/get-lms-course-progress/get-lms-course-progress.handler';
import { UpdateSubjectProgressHandler } from '#student-360/academic-offering/subject/application/update-subject-progress/update-subject-progress.handler';
import { UpdateCourseModuleProgressHandler } from '#lms-wrapper/application/lms-course/update-course-module-progress/update-course-module-progress.handler';

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

export const getSubjectProgressHandler = {
  provide: GetSubjectProgressHandler,
  useFactory: (
    subjectGetter: SubjectGetter,
    getLmsCourseProgressHandler: GetLmsCourseProgressHandler,
  ): GetSubjectProgressHandler =>
    new GetSubjectProgressHandler(subjectGetter, getLmsCourseProgressHandler),
  inject: [SubjectGetter, GetLmsCourseProgressHandler],
};

export const updateSubjectProgressHandler = {
  provide: UpdateSubjectProgressHandler,
  useFactory: (
    updateCourseModuleProgressHandler: UpdateCourseModuleProgressHandler,
  ): UpdateSubjectProgressHandler =>
    new UpdateSubjectProgressHandler(updateCourseModuleProgressHandler),
  inject: [UpdateCourseModuleProgressHandler],
};

export const studentSubjectHandlers = [
  getSubjectHandler,
  getSubjectProgressHandler,
  updateSubjectProgressHandler,
];
