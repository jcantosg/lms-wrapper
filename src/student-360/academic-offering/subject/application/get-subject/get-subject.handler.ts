import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetSubjectQuery } from '#student-360/academic-offering/subject/application/get-subject/get-subject.query';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { Student } from '#shared/domain/entity/student.entity';
import { StudentSubjectNotFoundException } from '#shared/domain/exception/student-360/student-subject-not-found.exception';

export class GetSubjectHandler implements QueryHandler {
  constructor(private readonly subjectGetter: SubjectGetter) {}

  async handle(query: GetSubjectQuery): Promise<Subject> {
    const subject = await this.subjectGetter.get(query.subjectId);
    if (!this.checkStudentCanSeeSubject(query.student, subject)) {
      throw new StudentSubjectNotFoundException();
    }

    return subject;
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
