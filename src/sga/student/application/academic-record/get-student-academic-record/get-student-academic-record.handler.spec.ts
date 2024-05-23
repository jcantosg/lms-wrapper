import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import {
  getASGAStudent,
  getAnAcademicRecord,
  getAnAdminUser,
} from '#test/entity-factory';
import {
  getAStudentGetterMock,
  getAnAcademicRecordGetterMock,
} from '#test/service-factory';
import { GetStudentAcademicRecordHandler } from '#student/application/academic-record/get-student-academic-record/get-student-academic-record.handler';

import { GetStudentAcademicRecordQuery } from '#student/application/academic-record/get-student-academic-record/get-student-academic-record.query';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';
import { StudentGetter } from '#shared/domain/service/student-getter.service';

let handler: GetStudentAcademicRecordHandler;
let studentGetter: StudentGetter;
let academicRecordGetter: AcademicRecordGetter;
let getAcademicRecordSpy: jest.SpyInstance;
let getStudentSpy: jest.SpyInstance;

describe('GetStudentAcademicRecordHandler', () => {
  beforeAll(() => {
    academicRecordGetter = getAnAcademicRecordGetterMock();
    studentGetter = getAStudentGetterMock();
    handler = new GetStudentAcademicRecordHandler(
      academicRecordGetter,
      studentGetter,
    );
    getAcademicRecordSpy = jest.spyOn(
      academicRecordGetter,
      'getStudentAcademicRecord',
    );
    getStudentSpy = jest.spyOn(studentGetter, 'get');
  });

  it('should return an academic record array', async () => {
    const academicRecord = getAnAcademicRecord();
    getStudentSpy.mockResolvedValue(getASGAStudent());
    getAcademicRecordSpy.mockResolvedValue([academicRecord]);
    const query = new GetStudentAcademicRecordQuery(
      'studentId',
      getAnAdminUser(),
    );

    const result = await handler.handle(query);

    expect(result).toEqual([academicRecord]);
  });

  it('should throw a StudentNotFoundException', async () => {
    getStudentSpy.mockResolvedValue(null);
    const query = new GetStudentAcademicRecordQuery(
      'studentId',
      getAnAdminUser(),
    );

    await expect(handler.handle(query)).rejects.toThrow(
      StudentNotFoundException,
    );
  });
});
