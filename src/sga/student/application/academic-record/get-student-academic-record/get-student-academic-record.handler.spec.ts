import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import {
  getAnAcademicRecord,
  getAnAdministrativeProcess,
  getAnAdminUser,
  getASGAStudent,
} from '#test/entity-factory';
import {
  getAnAcademicRecordGetterMock,
  getAStudentGetterMock,
} from '#test/service-factory';
import { GetStudentAcademicRecordHandler } from '#student/application/academic-record/get-student-academic-record/get-student-academic-record.handler';

import { GetStudentAcademicRecordQuery } from '#student/application/academic-record/get-student-academic-record/get-student-academic-record.query';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { AdministrativeProcessMockRepository } from '#test/mocks/sga/student/administrative-process.mock-repository';

let handler: GetStudentAcademicRecordHandler;
let studentGetter: StudentGetter;
let academicRecordGetter: AcademicRecordGetter;
let administrativeProcessRepository: AdministrativeProcessRepository;
let getAcademicRecordSpy: jest.SpyInstance;
let getStudentSpy: jest.SpyInstance;
let getAdminProcessSpy: jest.SpyInstance;

const adminProcess = getAnAdministrativeProcess();

describe('GetStudentAcademicRecordHandler', () => {
  beforeAll(() => {
    academicRecordGetter = getAnAcademicRecordGetterMock();
    studentGetter = getAStudentGetterMock();
    administrativeProcessRepository = new AdministrativeProcessMockRepository();
    handler = new GetStudentAcademicRecordHandler(
      academicRecordGetter,
      studentGetter,
      administrativeProcessRepository,
    );
    getAcademicRecordSpy = jest.spyOn(
      academicRecordGetter,
      'getStudentAcademicRecords',
    );
    getStudentSpy = jest.spyOn(studentGetter, 'get');
    getAdminProcessSpy = jest.spyOn(
      administrativeProcessRepository,
      'getByAcademicRecord',
    );
  });

  it('should return an academic record array', async () => {
    const academicRecord = getAnAcademicRecord();
    getStudentSpy.mockResolvedValue(getASGAStudent());
    getAcademicRecordSpy.mockResolvedValue([academicRecord]);
    getAdminProcessSpy.mockResolvedValue([adminProcess]);
    const query = new GetStudentAcademicRecordQuery(
      'studentId',
      getAnAdminUser(),
    );

    const result = await handler.handle(query);

    expect(result).toEqual([
      { record: academicRecord, administrativeProcess: adminProcess },
    ]);
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
