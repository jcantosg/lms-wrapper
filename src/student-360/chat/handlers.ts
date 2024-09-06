import { TeacherChatsHandler } from '#student-360/chat/application/teacher-chats/teacher-chats.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { EditChatroomHandler } from '#shared/application/edit-chatroom/edit-chatroom.handler';
import { StudentSubjectsToChatGetter } from '#shared/domain/service/student-subjects-to-chat-getter.service';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';

const teacherChatsHandler = {
  provide: TeacherChatsHandler,
  useFactory: (
    academicRecordRepository: AcademicRecordRepository,
    academicRecordGetter: AcademicRecordGetter,
    chatroomRepository: ChatroomRepository,
    internalGroupRepository: InternalGroupRepository,
    studentSubjectsToChatService: StudentSubjectsToChatGetter,
  ): TeacherChatsHandler =>
    new TeacherChatsHandler(
      academicRecordRepository,
      academicRecordGetter,
      chatroomRepository,
      internalGroupRepository,
      studentSubjectsToChatService,
    ),
  inject: [
    AcademicRecordRepository,
    AcademicRecordGetter,
    ChatroomRepository,
    InternalGroupRepository,
    StudentSubjectsToChatGetter,
  ],
};

const editChatroomHandler = {
  provide: EditChatroomHandler,
  useFactory: (chatroomRepository: ChatroomRepository): EditChatroomHandler =>
    new EditChatroomHandler(chatroomRepository),
  inject: [ChatroomRepository],
};

export const chatHandlers = [teacherChatsHandler, editChatroomHandler];
