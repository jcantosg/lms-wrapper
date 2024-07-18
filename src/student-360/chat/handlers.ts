import { TeacherChatsHandler } from '#student-360/chat/application/teacher-chats/teacher-chats.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { EditChatroomHandler } from '#student-360/chat/application/edit-chatroom/edit-chatroom.handler';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';

const teacherChatsHandler = {
  provide: TeacherChatsHandler,
  useFactory: (
    academicRecordRepository: AcademicRecordRepository,
    academicRecordGetter: AcademicRecordGetter,
    chatroomRepository: ChatroomRepository,
    internalGroupRepository: InternalGroupRepository,
  ): TeacherChatsHandler =>
    new TeacherChatsHandler(
      academicRecordRepository,
      academicRecordGetter,
      chatroomRepository,
      internalGroupRepository,
    ),
  inject: [
    AcademicRecordRepository,
    AcademicRecordGetter,
    ChatroomRepository,
    InternalGroupRepository,
  ],
};

const editChatroomHandler = {
  provide: EditChatroomHandler,
  useFactory: (chatroomRepository: ChatroomRepository): EditChatroomHandler =>
    new EditChatroomHandler(chatroomRepository),
  inject: [ChatroomRepository],
};

export const chatHandlers = [teacherChatsHandler, editChatroomHandler];
