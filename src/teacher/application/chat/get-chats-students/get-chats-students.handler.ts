import { QueryHandler } from '#shared/domain/bus/query.handler';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { GetChatsStudentsQuery } from '#/teacher/application/chat/get-chats-students/get-chats-students.query';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { Chatroom } from '#shared/domain/entity/chatroom.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { GetChatsStudentsCriteria } from '#/teacher/application/chat/get-chats-students/get-chats-students.criteria';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';

export class GetChatsStudentsHandler implements QueryHandler {
  constructor(
    private readonly chatroomRepository: ChatroomRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly blockRelationRepository: BlockRelationRepository,
  ) {}

  async handle(query: GetChatsStudentsQuery) {
    const chatrooms = await this.chatroomRepository.matching(
      new GetChatsStudentsCriteria(query),
    );

    if (chatrooms.length === 0) {
      return [];
    }

    const studentIds = chatrooms.map((chatroom) => chatroom.student.id);
    const subjectIds = chatrooms.map(
      (chatroom) => chatroom.internalGroup.subject.id,
    );

    const enrollments =
      await this.enrollmentRepository.getByStudentsAndSubjects(
        studentIds,
        subjectIds,
      );

    const visibleChatrooms: Chatroom[] = [];

    await Promise.all(
      chatrooms.map(async (chatroom) => {
        const subject = chatroom.internalGroup.subject;
        const student = chatroom.student;
        const enrollment = enrollments.find(
          (enrollment) =>
            enrollment.academicRecord.student.id === student.id &&
            enrollment.subject.id === subject.id,
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
    const programBlock = enrollment.programBlock;
    const academicPeriod = enrollment.academicRecord.academicPeriod;
    const blockRelation =
      await this.blockRelationRepository.getByProgramBlockAndAcademicPeriod(
        programBlock,
        academicPeriod,
      );
    const programBlockStartDate = blockRelation!.periodBlock.startDate;

    if (enrollment.academicRecord.status !== AcademicRecordStatusEnum.VALID) {
      return false;
    }

    if (
      enrollment.visibility === EnrollmentVisibilityEnum.YES ||
      (enrollment.visibility === EnrollmentVisibilityEnum.PD &&
        programBlockStartDate <= new Date())
    ) {
      if (!enrollment.subject.isRegulated) {
        return true;
      }

      if (enrollment.getLastCall()?.status !== SubjectCallStatusEnum.PASSED) {
        return true;
      }
    }

    return false;
  }
}
