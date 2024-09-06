import { CreateLmsEnrollmentHandler } from '#lms-wrapper/application/create-lms-enrollment/create-lms-enrollment.handler';
import { LmsEnrollmentRepository } from '#lms-wrapper/domain/repository/lms-enrollment.repository';
import { CreateLmsEnrollmentCommand } from '#lms-wrapper/application/create-lms-enrollment/create-lms-enrollment.command';
import { LmsEnrollmentMockRepository } from '#test/mocks/lms-wrapper/lms-enrollment.mock-repository';
import clearAllMocks = jest.clearAllMocks;

let handler: CreateLmsEnrollmentHandler;
let repository: LmsEnrollmentRepository;
let createEnrollmentSpy: jest.SpyInstance;

const command = new CreateLmsEnrollmentCommand(1, 2, new Date(), new Date());

describe('Create Lms Enrollment Handler', () => {
  beforeAll(() => {
    repository = new LmsEnrollmentMockRepository();
    handler = new CreateLmsEnrollmentHandler(repository);
    createEnrollmentSpy = jest.spyOn(repository, 'save');
  });
  it('should create a lms enrollment', async () => {
    await handler.handle(command);
    expect(createEnrollmentSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
