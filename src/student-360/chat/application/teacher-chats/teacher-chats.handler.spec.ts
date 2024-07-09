import { TeacherChatsHandler } from '#student-360/chat/application/teacher-chats/teacher-chats.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import {
  getAChatroom,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAcademicRecord,
  getAnEnrollment,
  getAnInternalGroup,
  getAPeriodBlock,
  getAProgramBlock,
  getASGAStudent,
  getASubject,
} from '#test/entity-factory';
import { getAnAcademicRecordGetterMock } from '#test/service-factory';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordMockRepository } from '#test/mocks/sga/student/academic-record.mock-repository';
import { ChatroomMockRepository } from '#test/mocks/shared/chatroom.mock-repository';
import { TeacherChatsQuery } from '#student-360/chat/application/teacher-chats/teacher-chats.query';

let handler: TeacherChatsHandler;
let academicRecordGetter: AcademicRecordGetter;
let academicRecordRepository: AcademicRecordRepository;
let chatroomRepository: ChatroomRepository;
let academicRecordMatchingSpy: jest.SpyInstance;
let chatroomGetByStudentSpy: jest.SpyInstance;
let getStudentAcademicRecordsSpy: jest.SpyInstance;

const academicRecord = getAnAcademicRecord();
const student = getASGAStudent();
const subject = getASubject();
const enrollment = getAnEnrollment();

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

programBlock.subjects = [subject];

academicProgram.programBlocks = [programBlock];
academicRecord.academicPeriod = academicPeriod;
academicRecord.academicProgram = academicProgram;
student.internalGroups = [internalGroup];
internalGroup.subject = subject;
internalGroup.academicPeriod = academicPeriod;
internalGroup.academicProgram = academicProgram;

const query = new TeacherChatsQuery(student);

describe('Teacher Chats Handler Test', () => {
  beforeAll(() => {
    academicRecordRepository = new AcademicRecordMockRepository();
    chatroomRepository = new ChatroomMockRepository();

    academicRecordGetter = getAnAcademicRecordGetterMock();
    academicRecordMatchingSpy = jest.spyOn(
      academicRecordRepository,
      'matching',
    );
    chatroomGetByStudentSpy = jest.spyOn(chatroomRepository, 'getByStudent');
    getStudentAcademicRecordsSpy = jest.spyOn(
      academicRecordGetter,
      'getStudentAcademicRecord',
    );
    handler = new TeacherChatsHandler(
      academicRecordRepository,
      academicRecordGetter,
      chatroomRepository,
    );
  });

  it('should get teacher chats empty when student has not academic records', async () => {
    academicRecordMatchingSpy.mockImplementation(() => Promise.resolve([]));
    chatroomGetByStudentSpy.mockImplementation(() => Promise.resolve([]));
    const response = await handler.handle(query);
    expect(response).toHaveLength(0);
  });

  it('should get teacher chats', async () => {
    academicRecordMatchingSpy.mockImplementation(() =>
      Promise.resolve([academicRecord]),
    );
    getStudentAcademicRecordsSpy.mockImplementation(() =>
      Promise.resolve(academicRecord),
    );

    chatroomGetByStudentSpy.mockImplementation(() =>
      Promise.resolve([chatroom]),
    );

    const response = await handler.handle(query);
    expect(response).toEqual([chatroom]);
  });
});
