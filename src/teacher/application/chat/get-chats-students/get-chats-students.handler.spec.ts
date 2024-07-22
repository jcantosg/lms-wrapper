import { GetChatsStudentsHandler } from '#/teacher/application/chat/get-chats-students/get-chats-students.handler';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import {
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
import {
  getAnAcademicRecordGetterMock,
  getASubjectsToChatGetterMock,
} from '#test/service-factory';
import { EnrollmentMockRepository } from '#test/mocks/sga/student/enrollment.mock-repository';
import { StudentSubjectsToChatGetter } from '#shared/domain/service/student-subjects-to-chat-getter.service';

let handler: GetChatsStudentsHandler;
let chatroomRepository: ChatroomRepository;
let enrollmentRepository: EnrollmentRepository;
let academicRecordGetter: AcademicRecordGetter;
let studentSubjectsToChatGetter: StudentSubjectsToChatGetter;

let chatroomMatchingSpy: jest.SpyInstance;
let enrollmentGetByStudentAndSubjectSpy: jest.SpyInstance;
let academicRecordGetterGetStudentAcademicRecord: jest.SpyInstance;
let getSubjectsToChat: jest.SpyInstance;

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
    studentSubjectsToChatGetter = getASubjectsToChatGetterMock();

    chatroomMatchingSpy = jest.spyOn(chatroomRepository, 'matching');
    enrollmentGetByStudentAndSubjectSpy = jest.spyOn(
      enrollmentRepository,
      'getByStudentAndSubject',
    );
    academicRecordGetterGetStudentAcademicRecord = jest.spyOn(
      academicRecordGetter,
      'getStudentAcademicRecord',
    );
    getSubjectsToChat = jest.spyOn(studentSubjectsToChatGetter, 'getSubjects');

    handler = new GetChatsStudentsHandler(
      chatroomRepository,
      enrollmentRepository,
      academicRecordGetter,
      studentSubjectsToChatGetter,
    );
  });

  it('should return visible chatrooms', async () => {
    chatroomMatchingSpy.mockResolvedValue([chatroom]);
    enrollmentGetByStudentAndSubjectSpy.mockResolvedValue(enrollment);
    academicRecordGetterGetStudentAcademicRecord.mockResolvedValue(
      academicRecord,
    );
    getSubjectsToChat.mockResolvedValue([subject]);

    const result = await handler.handle(query);

    expect(result).toEqual([chatroom]);
  });
});
