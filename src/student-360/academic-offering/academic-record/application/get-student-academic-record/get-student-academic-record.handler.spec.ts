import { GetStudentAcademicRecordHandler } from '#student-360/academic-offering/academic-record/application/get-student-academic-record/get-student-academic-record.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import {
  getAnAcademicProgram,
  getAnAcademicRecord,
  getAProgramBlock,
  getAnEdaeUser,
  getASGAStudent,
} from '#test/entity-factory';
import { GetStudentAcademicRecordQuery } from '#student-360/academic-offering/academic-record/application/get-student-academic-record/get-student-academic-record.query';
import {
  getAnAcademicRecordGetterMock,
  getAnInternalGroupDefaultTeacherGetterMock,
} from '#test/service-factory';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';
import { LmsCourseMockRepository } from '#test/mocks/lms-wrapper/lms-course.mock-repository';
import { GetLmsCourseProgressHandler } from '#lms-wrapper/application/lms-course/get-lms-course-progress/get-lms-course-progress.handler';
import { AcademicRecordBlockZeroNotFoundException } from '#student-360/academic-offering/academic-record/domain/exception/academic-record.block-zero-not-found.exception';
import { InternalGroupDefaultTeacherGetter } from '#student/domain/service/internal-group-default-teacher-getter.service';
import clearAllMocks = jest.clearAllMocks;

let handler: GetStudentAcademicRecordHandler;
let academicRecordGetter: AcademicRecordGetter;
let internalGroupDefaulTeacherGetter: InternalGroupDefaultTeacherGetter;
let getAcademicRecordSpy: jest.SpyInstance;
let getInternalGroupDefaultTeacherSpy: jest.SpyInstance;

const academicRecord = getAnAcademicRecord();
academicRecord.academicProgram = getAnAcademicProgram();
const programBlock = getAProgramBlock();
programBlock.name = 'Bloque 0';
academicRecord.academicProgram.programBlocks.push(programBlock);
const academicRecordWithoutZeroBlock = getAnAcademicRecord();
const student = getASGAStudent();
const query = new GetStudentAcademicRecordQuery(academicRecord.id, student);

describe('Get Academic Record Handler Test', () => {
  beforeAll(() => {
    academicRecordGetter = getAnAcademicRecordGetterMock();
    internalGroupDefaulTeacherGetter =
      getAnInternalGroupDefaultTeacherGetterMock();
    handler = new GetStudentAcademicRecordHandler(
      academicRecordGetter,
      new GetLmsCourseProgressHandler(new LmsCourseMockRepository()),
      internalGroupDefaulTeacherGetter,
    );
    getAcademicRecordSpy = jest.spyOn(
      academicRecordGetter,
      'getStudentAcademicRecord',
    );
    getInternalGroupDefaultTeacherSpy = jest.spyOn(
      internalGroupDefaulTeacherGetter,
      'get',
    );
  });
  it('should throw an AcademicRecordNotFoundException', () => {
    getAcademicRecordSpy.mockImplementation(() => {
      throw new AcademicRecordNotFoundException();
    });
    expect(handler.handle(query)).rejects.toThrow(
      AcademicRecordNotFoundException,
    );
  });
  it('should throw a AcademicRecordBlockZeroNotFoundException', () => {
    getAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve(academicRecordWithoutZeroBlock),
    );
    expect(handler.handle(query)).rejects.toThrow(
      AcademicRecordBlockZeroNotFoundException,
    );
  });
  it('should get an AcademicRecord', async () => {
    getAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve(academicRecord),
    );
    getInternalGroupDefaultTeacherSpy.mockImplementation(() =>
      Promise.resolve(getAnEdaeUser()),
    );
    const response = await handler.handle(query);
    expect(response).toEqual(academicRecord);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
