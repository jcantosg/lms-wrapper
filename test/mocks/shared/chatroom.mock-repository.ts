import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';

export class ChatroomMockRepository implements ChatroomRepository {
  save = jest.fn();
  saveBatch = jest.fn();
  getByStudent = jest.fn();
  existsByStudentAndTeacherAndInternalGroup = jest.fn();
}
