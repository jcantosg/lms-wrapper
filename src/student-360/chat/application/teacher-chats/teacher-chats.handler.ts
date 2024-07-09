import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { TeacherChatsQuery } from '#student-360/chat/application/teacher-chats/teacher-chats.query';
import { GetStudentAcademicRecordsCriteria } from '#student-360/academic-offering/academic-record/application/get-student-academic-records/get-student-academic-records.criteria';
import { GetStudentAcademicRecordsQuery } from '#student-360/academic-offering/academic-record/application/get-student-academic-records/get-student-academic-records.query';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { Chatroom } from '#shared/domain/entity/chatroom.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';

export class TeacherChatsHandler implements QueryHandler {
  constructor(
    private readonly academicRecordRepository: AcademicRecordRepository,
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly chatroomRepository: ChatroomRepository,
  ) {}

  async handle(query: TeacherChatsQuery): Promise<Chatroom[]> {
    const academicRecords = await this.getStudentAcademicRecords(
      query.student.id,
    );

    const subjectsToChat: Subject[] = [];
    const studentInternalGroupsFilter: InternalGroup[] = [];

    for (const academicRecord of academicRecords) {
      const academicRecordDetail =
        await this.academicRecordGetter.getStudentAcademicRecord(
          academicRecord.id,
          query.student,
        );

      subjectsToChat.push(...this.getSubjectsToChat(academicRecordDetail));

      subjectsToChat.map((subject) => {
        query.student.internalGroups.filter((internalGroup) => {
          if (
            internalGroup.subject.id === subject.id &&
            academicRecordDetail.academicProgram.id ===
              internalGroup.academicProgram.id &&
            internalGroup.academicPeriod.id ===
              academicRecordDetail.academicPeriod.id
          ) {
            studentInternalGroupsFilter.push(internalGroup);
          }
        });
      });
    }

    const studentInternalGroupsFilterIds = studentInternalGroupsFilter.map(
      (group) => group.id,
    );

    const chatrooms = await this.chatroomRepository.getByStudent(
      query.student.id,
    );

    return chatrooms.filter((chatroom) =>
      studentInternalGroupsFilterIds.includes(chatroom.internalGroup.id),
    );
  }

  private getSubjectsToChat(academicRecordDetail: AcademicRecord) {
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

  private async getStudentAcademicRecords(studentId: string) {
    const getStudentAcademicRecordsQuery = new GetStudentAcademicRecordsQuery(
      studentId,
    );
    const criteria = new GetStudentAcademicRecordsCriteria(
      getStudentAcademicRecordsQuery,
    );

    return await this.academicRecordRepository.matching(criteria);
  }
}
