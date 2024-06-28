import { GetStudentAcademicRecordHandler } from '#student-360/academic-offering/academic-record/application/get-student-academic-record/get-student-academic-record.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { getAnAcademicRecord, getASGAStudent } from '#test/entity-factory';
import { GetStudentAcademicRecordQuery } from '#student-360/academic-offering/academic-record/application/get-student-academic-record/get-student-academic-record.query';
import { getAnAcademicRecordGetterMock } from '#test/service-factory';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';
import clearAllMocks = jest.clearAllMocks;

let handler: GetStudentAcademicRecordHandler;
let academicRecordGetter: AcademicRecordGetter;
let getAcademicRecordSpy: jest.SpyInstance;

const academicRecord = getAnAcademicRecord();
const student = getASGAStudent();
const query = new GetStudentAcademicRecordQuery(academicRecord.id, student);

describe('Get Academic Record Handler Test', () => {
  beforeAll(() => {
    academicRecordGetter = getAnAcademicRecordGetterMock();
    handler = new GetStudentAcademicRecordHandler(academicRecordGetter);
    getAcademicRecordSpy = jest.spyOn(
      academicRecordGetter,
      'getStudentAcademicRecord',
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
  it('should get an AcademicRecord', async () => {
    getAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve(academicRecord),
    );
    const response = await handler.handle(query);
    expect(response).toEqual(academicRecord);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
