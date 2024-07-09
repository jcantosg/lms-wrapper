import { TeacherChatsHandler } from '#student-360/chat/application/teacher-chats/teacher-chats.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';

const teacherChatsHandler = {
  provide: TeacherChatsHandler,
  useFactory: (
    academicRecordRepository: AcademicRecordRepository,
    academicRecordGetter: AcademicRecordGetter,
    chatroomRepository: ChatroomRepository,
  ): TeacherChatsHandler =>
    new TeacherChatsHandler(
      academicRecordRepository,
      academicRecordGetter,
      chatroomRepository,
    ),
  inject: [AcademicRecordRepository, AcademicRecordGetter, ChatroomRepository],
};

export const chatHandlers = [teacherChatsHandler];
