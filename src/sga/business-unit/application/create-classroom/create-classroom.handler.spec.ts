import { CreateClassroomHandler } from '#business-unit/application/create-classroom/create-classroom.handler';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { CreateClassroomCommand } from '#business-unit/application/create-classroom/create-classroom.command';
import { getAnAdminUser, getAnExaminationCenter } from '#test/entity-factory';
import { v4 as uuid } from 'uuid';
import {
  getAdminUserGetterMock,
  getAnExaminationCenterGetterMock,
} from '#test/service-factory';
import { ClassroomMockRepository } from '#test/mocks/sga/business-unit/classroom.mock-repository';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { ClassroomDuplicatedException } from '#shared/domain/exception/business-unit/classroom-duplicated.exception';
import { ClassroomDuplicatedCodeException } from '#shared/domain/exception/business-unit/classroom-duplicated-code.exception';

let handler: CreateClassroomHandler;
let repository: ClassroomRepository;
let examinationGetter: ExaminationCenterGetter;
let adminUserGetter: AdminUserGetter;
let saveSpy: any;
let existsByNameAndExaminationCenterSpy: any;
let existByCodeSpy: any;
let existsByIdSpy: any;
let getExaminationCenterSpy: any;
let getAdminUserSpy: any;

const adminUser = getAnAdminUser();
const examinationCenter = getAnExaminationCenter();

const command = new CreateClassroomCommand(
  uuid(),
  'name',
  'code',
  2,
  examinationCenter.id,
  adminUser.id,
);

describe('Create Classroom Handler', () => {
  beforeAll(() => {
    examinationGetter = getAnExaminationCenterGetterMock();
    adminUserGetter = getAdminUserGetterMock();
    repository = new ClassroomMockRepository();
    handler = new CreateClassroomHandler(
      repository,
      examinationGetter,
      adminUserGetter,
    );
    saveSpy = jest.spyOn(repository, 'save');
    existsByNameAndExaminationCenterSpy = jest.spyOn(
      repository,
      'existsByNameAndExaminationCenter',
    );
    existByCodeSpy = jest.spyOn(repository, 'existsByCode');
    getExaminationCenterSpy = jest.spyOn(examinationGetter, 'get');
    getAdminUserSpy = jest.spyOn(adminUserGetter, 'get');
    existsByIdSpy = jest.spyOn(repository, 'existsById');
  });
  it('should create a classroom', async () => {
    existsByIdSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(false);
    });
    existsByNameAndExaminationCenterSpy.mockImplementation(
      (): Promise<boolean> => {
        return Promise.resolve(false);
      },
    );
    existByCodeSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(false);
    });

    getExaminationCenterSpy.mockImplementation(
      (): Promise<ExaminationCenter> => {
        return Promise.resolve(examinationCenter);
      },
    );

    getAdminUserSpy.mockImplementation((): Promise<AdminUser> => {
      return Promise.resolve(adminUser);
    });
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: command.id,
        _code: command.code,
        _name: command.name,
        _capacity: command.capacity,
        _examinationCenter: examinationCenter,
        _createdBy: adminUser,
      }),
    );
  });

  it('should throw a Classroom duplicated exception', async () => {
    existsByNameAndExaminationCenterSpy.mockImplementation(
      (): Promise<boolean> => {
        return Promise.resolve(true);
      },
    );
    await expect(handler.handle(command)).rejects.toThrow(
      ClassroomDuplicatedException,
    );
  });
  it('should throw a Classroom duplicated code exception', async () => {
    existsByNameAndExaminationCenterSpy.mockImplementation(
      (): Promise<boolean> => {
        return Promise.resolve(false);
      },
    );
    existByCodeSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(true);
    });
    await expect(handler.handle(command)).rejects.toThrow(
      ClassroomDuplicatedCodeException,
    );
  });
  it('should throw a Classroom duplicated error (id)', async () => {
    existsByIdSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(true);
    });
    await expect(handler.handle(command)).rejects.toThrow(
      ClassroomDuplicatedException,
    );
  });
});
