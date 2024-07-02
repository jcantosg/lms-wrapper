import { GetSubjectHandler } from '#student-360/academic-offering/subject/application/get-subject/get-subject.handler';
import {
  getAnAcademicProgram,
  getAnAcademicRecord,
  getAnEdaeUser,
  getAProgramBlock,
  getASGAStudent,
  getASubject,
} from '#test/entity-factory';
import { GetSubjectQuery } from '#student-360/academic-offering/subject/application/get-subject/get-subject.query';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import {
  getAnInternalGroupDefaultTeacherGetterMock,
  getASubjectGetterMock,
} from '#test/service-factory';
import { StudentSubjectNotFoundException } from '#shared/domain/exception/student-360/student-subject-not-found.exception';
import { InternalGroupDefaultTeacherGetter } from '#student/domain/service/internal-group-default-teacher-getter.service';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordMockRepository } from '#test/mocks/sga/student/academic-record.mock-repository';

let handler: GetSubjectHandler;
const student = getASGAStudent();
let subject = getASubject();
const academicRecord = getAnAcademicRecord();
const academicProgram = getAnAcademicProgram();
const programBlock = getAProgramBlock();
let subjectGetter: SubjectGetter;
let academicRecordRepository: AcademicRecordRepository;
let internalGroupDefaultTeacher: InternalGroupDefaultTeacherGetter;
let getSubjectSpy: jest.SpyInstance;
let getDefaultTeacherSpy: jest.SpyInstance;
let getAcademicRecordSpy: jest.SpyInstance;

const query = new GetSubjectQuery(subject.id, student);

describe('Get Subject Handler Unit Test', () => {
  beforeAll(() => {
    subjectGetter = getASubjectGetterMock();
    internalGroupDefaultTeacher = getAnInternalGroupDefaultTeacherGetterMock();
    academicRecordRepository = new AcademicRecordMockRepository();
    handler = new GetSubjectHandler(
      subjectGetter,
      internalGroupDefaultTeacher,
      academicRecordRepository,
    );
    getSubjectSpy = jest.spyOn(subjectGetter, 'get');
    getDefaultTeacherSpy = jest.spyOn(internalGroupDefaultTeacher, 'get');
    getAcademicRecordSpy = jest.spyOn(academicRecordRepository, 'matching');
  });

  it('should return a subject', async () => {
    programBlock.subjects.push(subject);
    academicProgram.programBlocks.push(programBlock);
    academicRecord.academicProgram = academicProgram;
    student.academicRecords.push(academicRecord);
    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    getDefaultTeacherSpy.mockImplementation(() =>
      Promise.resolve(getAnEdaeUser()),
    );
    getAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve([academicRecord]),
    );
    const response = await handler.handle(query);
    expect(response).toEqual(expect.objectContaining({ subject: subject }));
  });
  it('should throw a SubjectNotFoundException', () => {
    subject = getASubject();

    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    expect(handler.handle(query)).rejects.toThrow(
      StudentSubjectNotFoundException,
    );
  });
});
