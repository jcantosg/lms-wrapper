import { GetChatsStudentsHandler } from '#/teacher/application/chat/get-chats-students/get-chats-students.handler';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import {
  getABlockRelation,
  getAChatroom,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAcademicRecord,
  getAnEdaeUser,
  getAnEnrollment,
  getAnInternalGroup,
  getAPeriodBlock,
  getAProgramBlock,
  getASGAStudent,
  getASubject,
} from '#test/entity-factory';
import { GetChatsStudentsQuery } from '#/teacher/application/chat/get-chats-students/get-chats-students.query';
import { ChatroomMockRepository } from '#test/mocks/shared/chatroom.mock-repository';
import { EnrollmentMockRepository } from '#test/mocks/sga/student/enrollment.mock-repository';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import { BlockRelationMockRepository } from '#test/mocks/sga/academic-offering/block-relation.mock-repository';

let handler: GetChatsStudentsHandler;
let chatroomRepository: ChatroomRepository;
let enrollmentRepository: EnrollmentRepository;
let blockRelationRepository: BlockRelationRepository;

let chatroomMatchingSpy: jest.SpyInstance;
let enrollmentGetByStudentsAndSubjectsSpy: jest.SpyInstance;
let getByProgramBlockAndAcademicPeriodSpy: jest.SpyInstance;

const academicRecord = getAnAcademicRecord();
const student = getASGAStudent();
const subject = getASubject();
const enrollment = getAnEnrollment();
const teacher = getAnEdaeUser();

enrollment.academicRecord = academicRecord;
subject.enrollments = [enrollment];
const academicProgram = getAnAcademicProgram();
const academicPeriod = getAnAcademicPeriod();
const programBlock = getAProgramBlock();
const periodBlock = getAPeriodBlock();
const internalGroup = getAnInternalGroup(
  academicPeriod,
  academicProgram,
  periodBlock,
  subject,
);
const chatroom = getAChatroom(internalGroup);
const blockRelation = getABlockRelation(periodBlock, programBlock);
internalGroup.subject = subject;
chatroom.internalGroup = internalGroup;
chatroom.student = student;
chatroom.internalGroup.teachers = [teacher];

programBlock.subjects = [subject];

academicProgram.programBlocks = [programBlock];
academicRecord.academicPeriod = academicPeriod;
academicRecord.academicProgram = academicProgram;
academicRecord.student = student;
student.internalGroups = [internalGroup];
internalGroup.subject = subject;
internalGroup.academicPeriod = academicPeriod;
internalGroup.academicProgram = academicProgram;
enrollment.subject = subject;

const query = new GetChatsStudentsQuery(teacher);

describe('GetChatsStudentsHandler', () => {
  beforeAll(() => {
    chatroomRepository = new ChatroomMockRepository();
    enrollmentRepository = new EnrollmentMockRepository();
    blockRelationRepository = new BlockRelationMockRepository();

    chatroomMatchingSpy = jest.spyOn(chatroomRepository, 'matching');
    enrollmentGetByStudentsAndSubjectsSpy = jest.spyOn(
      enrollmentRepository,
      'getByStudentsAndSubjects',
    );

    getByProgramBlockAndAcademicPeriodSpy = jest.spyOn(
      blockRelationRepository,
      'getByProgramBlockAndAcademicPeriod',
    );

    handler = new GetChatsStudentsHandler(
      chatroomRepository,
      enrollmentRepository,
      blockRelationRepository,
    );
  });

  it('should return visible chatrooms', async () => {
    chatroomMatchingSpy.mockResolvedValue([chatroom]);
    enrollmentGetByStudentsAndSubjectsSpy.mockResolvedValue([enrollment]);
    getByProgramBlockAndAcademicPeriodSpy.mockResolvedValue(blockRelation);

    const result = await handler.handle(query);

    expect(result).toEqual([chatroom]);
  });
});
