import { GetSubjectsNotEnrolledHandler } from '#student/application/enrollment/get-subjects-not-enrolled/get-subjects-not-enrolled.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import {
  getAnAcademicRecord,
  getAnAdminUser,
  getASubject,
} from '#test/entity-factory';
import { GetSubjectsNotEnrolledQuery } from '#student/application/enrollment/get-subjects-not-enrolled/get-subjects-not-enrolled.query';
import { SubjectMockRepository } from '#test/mocks/sga/academic-offering/subject.mock-repository';
import { getAnAcademicRecordGetterMock } from '#test/service-factory';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';
import clearAllMocks = jest.clearAllMocks;

let handler: GetSubjectsNotEnrolledHandler;
let academicRecordGetter: AcademicRecordGetter;
let repository: SubjectRepository;
let getAcademicRecordSpy: jest.SpyInstance;
let getSubjectsNotEnrolledSpy: jest.SpyInstance;

const academicRecord = getAnAcademicRecord();
const subject = getASubject();

const query = new GetSubjectsNotEnrolledQuery(
  academicRecord.id,
  getAnAdminUser(),
);

describe('GetSubjectsNotEnrolledHandler', () => {
  beforeAll(() => {
    repository = new SubjectMockRepository();
    academicRecordGetter = getAnAcademicRecordGetterMock();
    handler = new GetSubjectsNotEnrolledHandler(
      academicRecordGetter,
      repository,
    );
    getAcademicRecordSpy = jest.spyOn(academicRecordGetter, 'getByAdminUser');
    getSubjectsNotEnrolledSpy = jest.spyOn(
      repository,
      'getSubjectsNotEnrolled',
    );
  });
  it('should get subjects not enrolled', async () => {
    getAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve(academicRecord),
    );
    getSubjectsNotEnrolledSpy.mockImplementation(() =>
      Promise.resolve([subject]),
    );
    const response = await handler.handle(query);
    expect(getAcademicRecordSpy).toHaveBeenCalledTimes(1);
    expect(getSubjectsNotEnrolledSpy).toHaveBeenCalledTimes(1);
    expect(response).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: subject.id,
        }),
      ]),
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

  afterAll(() => {
    clearAllMocks();
  });
});
