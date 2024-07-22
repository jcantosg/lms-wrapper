import { QueryHandler } from '#shared/domain/bus/query.handler';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { GetChatsStudentsQuery } from '#/teacher/application/chat/get-chats-students/get-chats-students.query';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { Chatroom } from '#shared/domain/entity/chatroom.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { GetChatsStudentsCriteria } from '#/teacher/application/chat/get-chats-students/get-chats-students.criteria';
import { StudentSubjectsToChatGetter } from '#shared/domain/service/student-subjects-to-chat-getter.service';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';

export class GetChatsStudentsHandler implements QueryHandler {
  constructor(
    private readonly chatroomRepository: ChatroomRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly studentSubjectsToChatGetter: StudentSubjectsToChatGetter,
  ) {}

  async handle(query: GetChatsStudentsQuery) {
    const chatrooms = await this.chatroomRepository.matching(
      new GetChatsStudentsCriteria(query),
    );

    const visibleChatrooms: Chatroom[] = [];

    await Promise.all(
      chatrooms.map(async (chatroom) => {
        const subject = chatroom.internalGroup.subject;
        const student = chatroom.student;
        const enrollment =
          await this.enrollmentRepository.getByStudentAndSubject(
            student.id,
            subject.id,
          );

        if (enrollment && (await this.hasStudentAccessToChat(enrollment))) {
          visibleChatrooms.push(chatroom);
        }
      }),
    );

    return visibleChatrooms;
  }

  private async hasStudentAccessToChat(
    enrollment: Enrollment,
  ): Promise<boolean> {
    if (enrollment.academicRecord.status !== AcademicRecordStatusEnum.VALID) {
      return false;
    }

    const academicRecordDetail =
      await this.academicRecordGetter.getStudentAcademicRecord(
        enrollment.academicRecord.id,
        enrollment.academicRecord.student,
      );

    const subjectsToChat =
      await this.studentSubjectsToChatGetter.getSubjects(academicRecordDetail);
    const subjectsToChatIds = subjectsToChat.map((subject) => subject.id);

    return subjectsToChatIds.includes(enrollment.subject.id);
  }
}
