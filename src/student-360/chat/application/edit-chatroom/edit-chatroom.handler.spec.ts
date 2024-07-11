import { EditChatroomHandler } from '#student-360/chat/application/edit-chatroom/edit-chatroom.handler';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import {
  getAChatroom,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnInternalGroup,
  getAPeriodBlock,
  getASubject,
} from '#test/entity-factory';
import { EditChatroomCommand } from '#student-360/chat/application/edit-chatroom/edit-chatroom.command';
import { ChatroomMockRepository } from '#test/mocks/shared/chatroom.mock-repository';
import { ChatroomNotFoundException } from '#shared/domain/exception/chat/chatroom.not-found.exception';

let handler: EditChatroomHandler;
let chatroomRepository: ChatroomRepository;

let getSpy: jest.SpyInstance;
let saveSpy: jest.SpyInstance;

const academicPeriod = getAnAcademicPeriod();
const academicProgram = getAnAcademicProgram();
const periodBlock = getAPeriodBlock();
const subject = getASubject();

academicPeriod.periodBlocks = [periodBlock];
const internalGroup = getAnInternalGroup(
  academicPeriod,
  academicProgram,
  periodBlock,
  subject,
);
const chatroom = getAChatroom(internalGroup);
const chatroomId = '12554107-5d48-4efe-8fdb-f266f6249cf8';

const command = new EditChatroomCommand(chatroom.id, chatroomId);

describe('EditChatroomHandler', () => {
  chatroomRepository = new ChatroomMockRepository();
  getSpy = jest.spyOn(chatroomRepository, 'get');
  saveSpy = jest.spyOn(chatroomRepository, 'save');

  handler = new EditChatroomHandler(chatroomRepository);

  it('should return 404 not found chatroom', async () => {
    getSpy.mockImplementation(() => Promise.resolve(null));

    await expect(async () => {
      await handler.handle(command);
    }).rejects.toThrow(ChatroomNotFoundException);
  });

  it('should edit chatroom', async () => {
    getSpy.mockImplementation(() => Promise.resolve(chatroom));

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: chatroom.id,
        _chatroomId: command.chatroomId,
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
