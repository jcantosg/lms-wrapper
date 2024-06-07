import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { getAnAdminUser, getAnEnrollment } from '#test/entity-factory';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { EnrollmentMockRepository } from '#test/mocks/sga/student/enrollment.mock-repository';
import { EnrollmentNotFoundException } from '#student/shared/exception/enrollment-not-found.exception';
import clearAllMocks = jest.clearAllMocks;

let service: EnrollmentGetter;
let repository: EnrollmentRepository;
let getSpy: jest.SpyInstance;
let getSpyByAdminUser: jest.SpyInstance;
const enrollment = getAnEnrollment();
const adminUser = getAnAdminUser();

describe('Enrollment Getter Service Unit Test', () => {
  beforeAll(() => {
    repository = new EnrollmentMockRepository();
    service = new EnrollmentGetter(repository);
    getSpy = jest.spyOn(repository, 'get');
    getSpyByAdminUser = jest.spyOn(repository, 'getByAdminUser');
  });

  it('should return an enrollment', async () => {
    getSpy.mockImplementation(() => Promise.resolve(enrollment));

    const response = await service.get(enrollment.id);
    expect(response).toBe(enrollment);
  });

  it('should throw an EnrollmentNotFoundException', () => {
    getSpy.mockImplementation(() => Promise.resolve(null));
    expect(service.get(enrollment.id)).rejects.toThrow(
      EnrollmentNotFoundException,
    );
  });

  it('should throw an EnrollmentNotFoundException when getByAdminUser', () => {
    getSpyByAdminUser.mockImplementation(() => Promise.resolve(null));
    expect(service.getByAdminUser(enrollment.id, adminUser)).rejects.toThrow(
      EnrollmentNotFoundException,
    );
  });

  it('should return an enrollment when getByAdminUser', async () => {
    getSpyByAdminUser.mockImplementation(() => Promise.resolve(enrollment));
    const response = await service.getByAdminUser(enrollment.id, adminUser);
    expect(response).toBe(enrollment);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
