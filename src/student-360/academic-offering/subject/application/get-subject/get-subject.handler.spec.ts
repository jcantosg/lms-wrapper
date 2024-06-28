import { GetSubjectHandler } from '#student-360/academic-offering/subject/application/get-subject/get-subject.handler';
import {
  getAnAcademicProgram,
  getAnAcademicRecord,
  getAProgramBlock,
  getASGAStudent,
  getASubject,
} from '#test/entity-factory';
import { GetSubjectQuery } from '#student-360/academic-offering/subject/application/get-subject/get-subject.query';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { getASubjectGetterMock } from '#test/service-factory';
import { StudentSubjectNotFoundException } from '#shared/domain/exception/student-360/student-subject-not-found.exception';

let handler: GetSubjectHandler;
const student = getASGAStudent();
let subject = getASubject();
const academicRecord = getAnAcademicRecord();
const academicProgram = getAnAcademicProgram();
const programBlock = getAProgramBlock();
let subjectGetter: SubjectGetter;
let getSubjectSpy: jest.SpyInstance;

const query = new GetSubjectQuery(subject.id, student);

describe('Get Subject Handler Unit Test', () => {
  beforeAll(() => {
    subjectGetter = getASubjectGetterMock();
    handler = new GetSubjectHandler(subjectGetter);
    getSubjectSpy = jest.spyOn(subjectGetter, 'get');
  });

  it('should return a subject', async () => {
    programBlock.subjects.push(subject);
    academicProgram.programBlocks.push(programBlock);
    academicRecord.academicProgram = academicProgram;
    student.academicRecords.push(academicRecord);
    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    const response = await handler.handle(query);
    expect(response).toBe(subject);
  });
  it('should throw a SubjectNotFoundException', () => {
    subject = getASubject();

    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    expect(handler.handle(query)).rejects.toThrow(
      StudentSubjectNotFoundException,
    );
  });
});
