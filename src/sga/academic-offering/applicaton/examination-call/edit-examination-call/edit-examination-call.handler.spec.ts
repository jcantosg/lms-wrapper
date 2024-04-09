import { getAnAdminUser, getAnExaminationCall } from '#test/entity-factory';
import { getAnExaminationCallGetterMock } from '#test/service-factory';
import clearAllMocks = jest.clearAllMocks;
import { EditExaminationCallHandler } from '#academic-offering/applicaton/examination-call/edit-examination-call/edit-examination-call.handler';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { ExaminationCallGetter } from '#academic-offering/domain/service/examination-call/examination-call-getter.service';
import { EditExaminationCallCommand } from '#academic-offering/applicaton/examination-call/edit-examination-call/edit-examination-call.command';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ExaminationCallMockRepository } from '#test/mocks/sga/academic-offering/examination-call.mock-repository';
import { ExaminationCallNotFoundException } from '#shared/domain/exception/academic-offering/examination-call.not-found.exception';
import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';

let handler: EditExaminationCallHandler;
let repository: ExaminationCallRepository;
let examinationCallGetter: ExaminationCallGetter;

const examinationCall = getAnExaminationCall();
const adminUser = getAnAdminUser();

let saveSpy: jest.SpyInstance;
let getExaminationCallSpy: jest.SpyInstance;

const command = new EditExaminationCallCommand(
  examinationCall.id,
  'new Name',
  new Date('2025-12-12'),
  new Date('2026-12-12'),
  adminUser.businessUnits.map((bu) => bu.id),
  adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
);

describe('Edit ExaminationCall Handler Unit Test', () => {
  beforeAll(() => {
    repository = new ExaminationCallMockRepository();
    examinationCallGetter = getAnExaminationCallGetterMock();
    handler = new EditExaminationCallHandler(repository, examinationCallGetter);
    saveSpy = jest.spyOn(repository, 'save');
    getExaminationCallSpy = jest.spyOn(examinationCallGetter, 'getByAdminUser');
  });

  it('should save a examinationCall', async () => {
    getExaminationCallSpy.mockImplementation(
      (): Promise<ExaminationCall> => Promise.resolve(examinationCall),
    );
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'new Name',
        startDate: new Date('2025-12-12'),
        endDate: new Date('2026-12-12'),
      }),
    );
  });

  it('should throw an ExaminationCallNotFoundException', async () => {
    getExaminationCallSpy.mockImplementation(
      (): Promise<ExaminationCall> =>
        Promise.reject(new ExaminationCallNotFoundException()),
    );
    await expect(handler.handle(command)).rejects.toThrow(
      ExaminationCallNotFoundException,
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
