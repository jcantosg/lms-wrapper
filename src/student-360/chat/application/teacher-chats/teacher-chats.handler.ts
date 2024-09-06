import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { TeacherChatsQuery } from '#student-360/chat/application/teacher-chats/teacher-chats.query';
import { GetStudentAcademicRecordsCriteria } from '#student-360/academic-offering/academic-record/application/get-student-academic-records/get-student-academic-records.criteria';
import { GetStudentAcademicRecordsQuery } from '#student-360/academic-offering/academic-record/application/get-student-academic-records/get-student-academic-records.query';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { Chatroom } from '#shared/domain/entity/chatroom.entity';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { StudentSubjectsToChatGetter } from '#shared/domain/service/student-subjects-to-chat-getter.service';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';

export class TeacherChatsHandler implements QueryHandler {
  constructor(
    private readonly academicRecordRepository: AcademicRecordRepository,
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly chatroomRepository: ChatroomRepository,
    private readonly internalGroupRepository: InternalGroupRepository,
    private readonly studentSubjectsToChatService: StudentSubjectsToChatGetter,
  ) {}

  async handle(query: TeacherChatsQuery): Promise<Chatroom[]> {
    const academicRecords = await this.getStudentAcademicRecords(
      query.student.id,
    );

    const studentInternalGroupsFilter: InternalGroup[] = [];
    const studentInternalGroups =
      await this.internalGroupRepository.getAllByStudent(query.student.id);

    for (const academicRecord of academicRecords) {
      const academicRecordDetail =
        await this.academicRecordGetter.getStudentAcademicRecord(
          academicRecord.id,
          query.student,
        );

      const subjectsToChat =
        await this.studentSubjectsToChatService.getSubjects(
          academicRecordDetail,
        );

      subjectsToChat.map((subject) => {
        studentInternalGroups.filter((internalGroup) => {
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
