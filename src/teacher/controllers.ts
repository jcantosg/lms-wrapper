import { LoginEdaeUserController } from '#/teacher/infrastructure/controller/login-edae-user.controller';
import { RefreshTokenEdaeUserController } from '#/teacher/infrastructure/controller/refresh-token-edae-user.controller';
import { LogoutEdaeUserController } from '#/teacher/infrastructure/controller/logout-edae-user.controller';
import { GetBusinessUnitsTeacherChatController } from '#/teacher/infrastructure/controller/get-business-units-teacher-chat/get-business-units-teacher-chat.controller';
import { GetAcademicPeriodsTeacherChatController } from '#/teacher/infrastructure/controller/get-academic-periods-teacher-chat/get-academic-periods-teacher-chat.controller';
import { GetTitlesTeacherChatController } from '#/teacher/infrastructure/controller/get-titles-teacher-chat/get-titles-teacher-chat.controller';
import { GetSubjectsTeacherChatController } from '#/teacher/infrastructure/controller/get-subjects-teacher-chat/get-subjects-teacher-chat.controller';
import { GetChatsStudentsController } from '#/teacher/infrastructure/controller/get-chats-students/get-chats-students.controller';
import { EditChatroomController } from '#/teacher/infrastructure/controller/edit-chatroom.controller';
import { TeacherMeController } from '#/teacher/infrastructure/controller/me/teacher-me.controller';

export const edaeUserControllers = [
  EditChatroomController,
  LoginEdaeUserController,
  RefreshTokenEdaeUserController,
  LogoutEdaeUserController,
  GetBusinessUnitsTeacherChatController,
  GetAcademicPeriodsTeacherChatController,
  GetTitlesTeacherChatController,
  GetSubjectsTeacherChatController,
  GetChatsStudentsController,
  TeacherMeController,
];
