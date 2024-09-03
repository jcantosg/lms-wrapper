import { GetChatsStudentsHandler } from '#/teacher/application/chat/get-chats-students/get-chats-students.handler';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
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
import { getAnAcademicRecordGetterMock } from '#test/service-factory';
import { EnrollmentMockRepository } from '#test/mocks/sga/student/enrollment.mock-repository';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import { BlockRelationMockRepository } from '#test/mocks/sga/academic-offering/block-relation.mock-repository';

let handler: GetChatsStudentsHandler;
let chatroomRepository: ChatroomRepository;
let enrollmentRepository: EnrollmentRepository;
let blockRelationRepository: BlockRelationRepository;
let academicRecordGetter: AcademicRecordGetter;

let chatroomMatchingSpy: jest.SpyInstance;
let enrollmentGetByStudentAndSubjectSpy: jest.SpyInstance;
let getByProgramBlockAndAcademicPeriodSpy: jest.SpyInstance;
let getAcademicRecordSpy: jest.SpyInstance;

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

programBlock.subjects = [subject];

academicProgram.programBlocks = [programBlock];
academicRecord.academicPeriod = academicPeriod;
academicRecord.academicProgram = academicProgram;
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
    academicRecordGetter = getAnAcademicRecordGetterMock();
    blockRelationRepository = new BlockRelationMockRepository();

    chatroomMatchingSpy = jest.spyOn(chatroomRepository, 'matching');
    enrollmentGetByStudentAndSubjectSpy = jest.spyOn(
      enrollmentRepository,
      'getByStudentAndSubject',
    );
    getAcademicRecordSpy = jest.spyOn(academicRecordGetter, 'get');

    getByProgramBlockAndAcademicPeriodSpy = jest.spyOn(
      blockRelationRepository,
      'getByProgramBlockAndAcademicPeriod',
    );

    handler = new GetChatsStudentsHandler(
      chatroomRepository,
      enrollmentRepository,
      academicRecordGetter,
      blockRelationRepository,
    );
  });

  it('should return visible chatrooms', async () => {
    chatroomMatchingSpy.mockResolvedValue([chatroom]);
    enrollmentGetByStudentAndSubjectSpy.mockResolvedValue(enrollment);
    getAcademicRecordSpy.mockResolvedValue(academicRecord);
    getByProgramBlockAndAcademicPeriodSpy.mockResolvedValue(blockRelation);

    const result = await handler.handle(query);

    expect(result).toEqual([chatroom]);
  });
});
