import { AdministrativeGroupStatusStudentGetter } from '#student/domain/service/administrative-group-status-student.getter.service';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { SubjectUpToBlockGetter } from '#academic-offering/domain/service/subject/subject-up-to-block-getter.service';
import { EnrollmentMockRepository } from '#test/mocks/sga/student/enrollment.mock-repository';
import { getASubjectUpToBlockGetterMock } from '#test/service-factory';
import {
  getAnAcademicRecord,
  getAnAdministrativeGroup,
  getAnEnrollment,
  getANotTakenSubjectCall,
  getASubject,
} from '#test/entity-factory';
import { StudentAdministrativeGroupStatusEnum } from '#student/domain/enum/student-administrative-group-status.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';

let service: AdministrativeGroupStatusStudentGetter;
let enrollmentRepository: EnrollmentRepository;
let subjectUpToBlockGetter: SubjectUpToBlockGetter;

let getSubjectsUpToBlockSpy: jest.SpyInstance;
let getByAcademicRecordSpy: jest.SpyInstance;

const subject = getASubject();
const enrollment = getAnEnrollment();
const subjectCall = getANotTakenSubjectCall();
const academicRecord = getAnAcademicRecord();
const administrativeGroup = getAnAdministrativeGroup();

enrollment.calls = [subjectCall];

describe('AdministrativeGroupStatusStudentGetter', () => {
  beforeAll(() => {
    enrollmentRepository = new EnrollmentMockRepository();
    subjectUpToBlockGetter = getASubjectUpToBlockGetterMock();

    getSubjectsUpToBlockSpy = jest.spyOn(
      subjectUpToBlockGetter,
      'getSubjectsUpToBlock',
    );

    getByAcademicRecordSpy = jest.spyOn(
      enrollmentRepository,
      'getByAcademicRecord',
    );

    service = new AdministrativeGroupStatusStudentGetter(
      enrollmentRepository,
      subjectUpToBlockGetter,
    );
  });

  it('Should return PENDING status if enrollment is zero', async () => {
    getSubjectsUpToBlockSpy.mockImplementation(() =>
      Promise.resolve([subject]),
    );
    getByAcademicRecordSpy.mockImplementation(() => Promise.resolve([]));

    const result = await service.getStatus(academicRecord, administrativeGroup);

    expect(result).toBe(StudentAdministrativeGroupStatusEnum.PENDING);
  });

  it('Should return PENDING status if subjects to check is zero', async () => {
    getSubjectsUpToBlockSpy.mockImplementation(() => Promise.resolve([]));
    getByAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve([enrollment]),
    );

    const result = await service.getStatus(academicRecord, administrativeGroup);

    expect(result).toBe(StudentAdministrativeGroupStatusEnum.PENDING);
  });

  it('Should return PENDING status if enrollment does not have a subject', async () => {
    getSubjectsUpToBlockSpy.mockImplementation(() =>
      Promise.resolve([subject]),
    );
    getByAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve([enrollment]),
    );

    const result = await service.getStatus(academicRecord, administrativeGroup);
    expect(result).toBe(StudentAdministrativeGroupStatusEnum.PENDING);
  });

  it('Should return PENDING status if enrollment has not passed a subject', async () => {
    getSubjectsUpToBlockSpy.mockImplementation(() =>
      Promise.resolve([subject]),
    );
    getByAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve([enrollment]),
    );

    enrollment.subject = subject;

    const result = await service.getStatus(academicRecord, administrativeGroup);

    expect(result).toBe(StudentAdministrativeGroupStatusEnum.PENDING);
  });

  it('Should return FINISH status if enrollment has passed all subjects', async () => {
    getSubjectsUpToBlockSpy.mockImplementation(() =>
      Promise.resolve([subject]),
    );
    getByAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve([enrollment]),
    );

    enrollment.subject = subject;
    enrollment.calls[0].status = SubjectCallStatusEnum.PASSED;

    const result = await service.getStatus(academicRecord, administrativeGroup);

    expect(result).toBe(StudentAdministrativeGroupStatusEnum.FINISH);
  });
});
