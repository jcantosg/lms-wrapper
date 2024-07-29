import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetSubjectQuery } from '#student-360/academic-offering/subject/application/get-subject/get-subject.query';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { Student } from '#shared/domain/entity/student.entity';
import { StudentSubjectNotFoundException } from '#shared/domain/exception/student-360/student-subject-not-found.exception';
import { InternalGroupDefaultTeacherGetter } from '#student/domain/service/internal-group-default-teacher-getter.service';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';

interface GetSubjectHandlerResponse {
  subject: Subject;
  defaultTeacher: EdaeUser | null;
  breadCrumb: {
    academicRecord: AcademicRecord;
    programBlock: ProgramBlock;
  };
}

export class GetSubjectHandler implements QueryHandler {
  constructor(
    private readonly subjectGetter: SubjectGetter,
    private internalGroupTeacherGetter: InternalGroupDefaultTeacherGetter,
    private academicRecordGetter: AcademicRecordGetter,
  ) {}

  async handle(query: GetSubjectQuery): Promise<GetSubjectHandlerResponse> {
    const subject = await this.subjectGetter.get(query.subjectId);
    if (!this.checkStudentCanSeeSubject(query.student, subject)) {
      throw new StudentSubjectNotFoundException();
    }
    const defaultTeacher = await this.internalGroupTeacherGetter.get(
      query.student.id,
      subject.id,
    );

    const academicRecord = await this.academicRecordGetter.get(
      query.academicRecordId,
    );
    if (!academicRecord) {
      throw new AcademicRecordNotFoundException();
    }
    const programBlock = academicRecord.academicProgram.programBlocks.find(
      (programBlock) =>
        programBlock.subjects.some(
          (subjectProgramBlock) => subject.id === subjectProgramBlock.id,
        ),
    );
    if (!programBlock) {
      throw new ProgramBlockNotFoundException();
    }

    return {
      subject: subject,
      defaultTeacher: defaultTeacher,
      breadCrumb: {
        academicRecord: academicRecord,
        programBlock: programBlock,
      },
    };
  }

  private checkStudentCanSeeSubject(
    student: Student,
    subject: Subject,
  ): boolean {
    let found = false;
    let i = 0;
    while (i < student.academicRecords.length && !found) {
      const academicRecord = student.academicRecords[i];
      const academicProgram = academicRecord.academicProgram;
      for (const programBlock of academicProgram.programBlocks) {
        for (const programBlockSubject of programBlock.subjects) {
          found =
            !found && subject.id === programBlockSubject.id ? true : found;
        }
      }
      i++;
    }

    return found;
  }
}
