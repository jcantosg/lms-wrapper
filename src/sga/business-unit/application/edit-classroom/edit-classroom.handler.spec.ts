import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { ClassroomGetter } from '#business-unit/domain/service/classroom-getter.service';
import { ClassroomDuplicatedException } from '#shared/domain/exception/business-unit/classroom-duplicated.exception';
import { getAClassroom, getAnAdminUser } from '#test/entity-factory';
import { ClassroomMockRepository } from '#test/mocks/sga/business-unit/classroom.mock-repository';
import {
  getAClassroomGetterMock,
  getAdminUserGetterMock,
} from '#test/service-factory';
import { EditClassroomHandler } from '#business-unit/application/edit-classroom/edit-classroom.handler';
import { EditClassroomCommand } from '#business-unit/application/edit-classroom/edit-classroom.command';
import { ClassroomDuplicatedCodeException } from '#shared/domain/exception/business-unit/classroom-duplicated-code.exception';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

let handler: EditClassroomHandler;
let repository: ClassroomRepository;
let classroomGetter: ClassroomGetter;
let adminUserGetter: AdminUserGetter;

let updateSpy: any;
let existsByNameAndExaminationCenterSpy: any;
let existByCodeSpy: any;
let getClassroomSpy: any;
let getAdminUserSpy: any;

const adminUser = getAnAdminUser();
const classroom = getAClassroom();

const command = new EditClassroomCommand(
  classroom.id,
  'name',
  'code',
  2,
  adminUser.id,
);

describe('Edit Classroom Handler', () => {
  beforeAll(() => {
    classroomGetter = getAClassroomGetterMock();
    adminUserGetter = getAdminUserGetterMock();
    repository = new ClassroomMockRepository();
    handler = new EditClassroomHandler(
      repository,
      classroomGetter,
      adminUserGetter,
    );
    updateSpy = jest.spyOn(repository, 'update');
    existsByNameAndExaminationCenterSpy = jest.spyOn(
      repository,
      'existsByNameAndExaminationCenter',
    );
    getClassroomSpy = jest.spyOn(classroomGetter, 'get');
    existByCodeSpy = jest.spyOn(repository, 'existsByCode');
    getAdminUserSpy = jest.spyOn(adminUserGetter, 'get');
  });

  it('should throw a Classroom duplicated exception', async () => {
    existsByNameAndExaminationCenterSpy.mockImplementation(
      (): Promise<boolean> => {
        return Promise.resolve(true);
      },
    );

    getClassroomSpy.mockImplementation((): Promise<Classroom | null> => {
      return Promise.resolve(classroom);
    });

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

  it('should edit a classroom', async () => {
    existsByNameAndExaminationCenterSpy.mockImplementation(
      (): Promise<boolean> => {
        return Promise.resolve(false);
      },
    );
    existByCodeSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(false);
    });

    getClassroomSpy.mockImplementation((): Promise<Classroom | null> => {
      return Promise.resolve(classroom);
    });

    getAdminUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(adminUser);
    });

    await handler.handle(command);

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _code: 'code',
        _name: 'name',
        _capacity: 2,
      }),
    );
  });
});
