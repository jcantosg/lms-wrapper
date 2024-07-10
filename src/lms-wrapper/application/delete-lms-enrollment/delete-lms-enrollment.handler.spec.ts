import { LmsEnrollmentRepository } from '#lms-wrapper/domain/repository/lms-enrollment.repository';
import { LmsEnrollmentMockRepository } from '#test/mocks/lms-wrapper/lms-enrollment.mock-repository';
import { DeleteLmsEnrollmentHandler } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.handler';
import { DeleteLmsEnrollmentCommand } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.command';
import clearAllMocks = jest.clearAllMocks;

let handler: DeleteLmsEnrollmentHandler;
let repository: LmsEnrollmentRepository;
let deleteLmsEnrollmentSpy: jest.SpyInstance;

const command = new DeleteLmsEnrollmentCommand(1, 2);

describe('Delete Lms Enrollment Handler', () => {
  beforeAll(() => {
    repository = new LmsEnrollmentMockRepository();
    handler = new DeleteLmsEnrollmentHandler(repository);
    deleteLmsEnrollmentSpy = jest.spyOn(repository, 'delete');
  });
  it('should create a lms enrollment', async () => {
    await handler.handle(command);
    expect(deleteLmsEnrollmentSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
