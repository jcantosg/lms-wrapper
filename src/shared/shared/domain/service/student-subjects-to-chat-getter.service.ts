import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';

export class StudentSubjectsToChatGetter {
  constructor() {}

  async getSubjects(academicRecordDetail: AcademicRecord): Promise<Subject[]> {
    const subjectsToChat: Subject[] = [];

    academicRecordDetail.academicProgram.programBlocks.map((programBlock) => {
      programBlock.subjects.map((subject) => {
        if (!subject.isRegulated) {
          return subjectsToChat.push(subject);
        }
        const enrollmentIndex = subject.enrollments.findIndex(
          (enrollment) =>
            enrollment.academicRecord.id === academicRecordDetail.id,
        );
        if (
          subject.enrollments[enrollmentIndex].getLastCall()?.status !==
          SubjectCallStatusEnum.PASSED
        ) {
          subjectsToChat.push(subject);
        }
      });
    });

    return subjectsToChat;
  }
}
