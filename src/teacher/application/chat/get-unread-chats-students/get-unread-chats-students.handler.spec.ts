import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import {
  getAChatroom,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnEdaeUser,
  getAnInternalGroup,
  getAPeriodBlock,
  getASubject,
} from '#test/entity-factory';
import { ChatroomMockRepository } from '#test/mocks/shared/chatroom.mock-repository';
import { GetUnreadChatsStudentsHandler } from '#/teacher/application/chat/get-unread-chats-students/get-unread-chats-students.handler';
import { GetUnreadChatsStudentsQuery } from '#/teacher/application/chat/get-unread-chats-students/get-unread-chats-students.query';

let handler: GetUnreadChatsStudentsHandler;
let chatroomRepository: ChatroomRepository;

let chatroomGetSpy: jest.SpyInstance;

const teacher = getAnEdaeUser();
const subject = getASubject();
const academicProgram = getAnAcademicProgram();
const academicPeriod = getAnAcademicPeriod();
const periodBlock = getAPeriodBlock();
const internalGroup = getAnInternalGroup(
  academicPeriod,
  academicProgram,
  periodBlock,
  subject,
);
const chatroom = getAChatroom(internalGroup);
chatroom.chatroomId = '123';

const query = new GetUnreadChatsStudentsQuery([chatroom.chatroomId], teacher);

describe('GetUnreadChatsStudentsHandler', () => {
  beforeAll(() => {
    chatroomRepository = new ChatroomMockRepository();
    chatroomGetSpy = jest.spyOn(chatroomRepository, 'getByEdaeUserAndFBIds');

    handler = new GetUnreadChatsStudentsHandler(chatroomRepository);
  });

  it('should return unread chatrooms', async () => {
    chatroomGetSpy.mockResolvedValue([chatroom]);
    const result = await handler.handle(query);

    expect(result).toEqual([chatroom]);
  });
});
