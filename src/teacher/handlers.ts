import { CreateEdaeUserRefreshTokenHandler } from '#/teacher/application/edae-user/create-edae-user-refresh-token/create-edae-user-refresh-token.handler';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserRefreshTokenRepository } from '#/teacher/domain/repository/edae-user-refresh-token.repository';
import { ExpireEdaeUserRefreshTokenHandler } from '#/teacher/application/edae-user/expire-edae-user-refresh-token/expire-edae-user-refresh-token.handler';
import { GetBusinessUnitsTeacherChatHandler } from '#/teacher/application/chat/get-business-units-teacher-chat/get-business-units-teacher-chat.hander';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { GetAcademicPeriodsTeacherChatHandler } from '#/teacher/application/chat/get-academic-periods-teacher-chat/get-academic-periods-teacher-chat.handler';
import { GetTitlesTeacherChatHandler } from '#/teacher/application/chat/get-titles-teacher-chat/get-titles-teacher-chat.handler';
import { GetSubjectsTeacherChatHandler } from '#/teacher/application/chat/get-subjects-teacher-chat/get-subjects-teacher-chat.handler';
import { GetChatsStudentsHandler } from '#/teacher/application/chat/get-chats-students/get-chats-students.handler';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { StudentSubjectsToChatGetter } from '#shared/domain/service/student-subjects-to-chat-getter.service';

const createEdaeUserRefreshTokenHandler = {
  provide: CreateEdaeUserRefreshTokenHandler,
  useFactory: (
    edaeUserGetter: EdaeUserGetter,
    repository: EdaeUserRefreshTokenRepository,
  ): CreateEdaeUserRefreshTokenHandler =>
    new CreateEdaeUserRefreshTokenHandler(edaeUserGetter, repository),
  inject: [EdaeUserGetter, EdaeUserRefreshTokenRepository],
};

const expireEdaeUserRefreshTokenHandler = {
  provide: ExpireEdaeUserRefreshTokenHandler,
  useFactory: (
    edaeUserGetter: EdaeUserGetter,
    repository: EdaeUserRefreshTokenRepository,
  ): ExpireEdaeUserRefreshTokenHandler =>
    new ExpireEdaeUserRefreshTokenHandler(edaeUserGetter, repository),
  inject: [EdaeUserGetter, EdaeUserRefreshTokenRepository],
};

const getBusinessUnitsTeacherChatHandler = {
  provide: GetBusinessUnitsTeacherChatHandler,
  useFactory: (
    internalGroupRepository: InternalGroupRepository,
  ): GetBusinessUnitsTeacherChatHandler =>
    new GetBusinessUnitsTeacherChatHandler(internalGroupRepository),
  inject: [InternalGroupRepository],
};

const getAcademicPeriodsTeacherChatHandler = {
  provide: GetAcademicPeriodsTeacherChatHandler,
  useFactory: (
    internalGroupRepository: InternalGroupRepository,
  ): GetAcademicPeriodsTeacherChatHandler =>
    new GetAcademicPeriodsTeacherChatHandler(internalGroupRepository),
  inject: [InternalGroupRepository],
};

const getTitlesTeacherChatHandler = {
  provide: GetTitlesTeacherChatHandler,
  useFactory: (
    internalGroupRepository: InternalGroupRepository,
  ): GetTitlesTeacherChatHandler =>
    new GetTitlesTeacherChatHandler(internalGroupRepository),
  inject: [InternalGroupRepository],
};

const getSubjectsTeacherChatHandler = {
  provide: GetSubjectsTeacherChatHandler,
  useFactory: (
    internalGroupRepository: InternalGroupRepository,
  ): GetSubjectsTeacherChatHandler =>
    new GetSubjectsTeacherChatHandler(internalGroupRepository),
  inject: [InternalGroupRepository],
};

const getChatsStudentsHandler = {
  provide: GetChatsStudentsHandler,
  useFactory: (
    chatroomRepository: ChatroomRepository,
    enrollmentRepository: EnrollmentRepository,
    academicRecordGetter: AcademicRecordGetter,
    studentSubjectsToChatGetter: StudentSubjectsToChatGetter,
  ): GetChatsStudentsHandler =>
    new GetChatsStudentsHandler(
      chatroomRepository,
      enrollmentRepository,
      academicRecordGetter,
      studentSubjectsToChatGetter,
    ),
  inject: [
    ChatroomRepository,
    EnrollmentRepository,
    AcademicRecordGetter,
    StudentSubjectsToChatGetter,
  ],
};

export const handlers = [
  createEdaeUserRefreshTokenHandler,
  expireEdaeUserRefreshTokenHandler,
  getBusinessUnitsTeacherChatHandler,
  getAcademicPeriodsTeacherChatHandler,
  getTitlesTeacherChatHandler,
  getSubjectsTeacherChatHandler,
  getChatsStudentsHandler,
];
