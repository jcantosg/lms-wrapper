import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetStudentAcademicRecordQuery } from '#student-360/academic-offering/academic-record/application/get-student-academic-record/get-student-academic-record.query';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { GetLmsCourseProgressHandler } from '#lms-wrapper/application/lms-course/get-lms-course-progress/get-lms-course-progress.handler';
import { GetLmsCourseProgressQuery } from '#lms-wrapper/application/lms-course/get-lms-course-progress/get-lms-course-progress.query';
import { InternalGroupDefaultTeacherGetter } from '#student/domain/service/internal-group-default-teacher-getter.service';

export class GetStudentAcademicRecordHandler implements QueryHandler {
  constructor(
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly getCourseProgressHandler: GetLmsCourseProgressHandler,
    private internalGroupTeacherGetter: InternalGroupDefaultTeacherGetter,
  ) {}

  async handle(query: GetStudentAcademicRecordQuery): Promise<AcademicRecord> {
    const academicRecord =
      await this.academicRecordGetter.getStudentAcademicRecord(
        query.academicRecordId,
        query.student,
      );
    for (const programBlock of academicRecord.academicProgram.programBlocks) {
      for (const subject of programBlock.subjects) {
        subject.lmsCourse!.value.progress =
          await this.getCourseProgressHandler.handle(
            new GetLmsCourseProgressQuery(
              subject.lmsCourse!.value.id,
              query.student.lmsStudent!.value.id,
            ),
          );
        subject.defaultTeacher = await this.internalGroupTeacherGetter.get(
          query.student.id,
          subject.id,
        );
      }
    }

    return academicRecord;
  }
}
