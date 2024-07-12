import { GetAdministrativeGroupByAcademicProgramHandler } from '#student/application/administrative-group/get-administrative-group-by-academic-program/get-administrative-group-by-academic-program.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { GetAdministrativeGroupByAcademicProgramQuery } from '#student/application/administrative-group/get-administrative-group-by-academic-program/get-administrative-group-by-academic-program.query';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import {
  getAnAdminUser,
  getAnAdministrativeGroup,
  getABusinessUnit,
} from '#test/entity-factory';

let handler: GetAdministrativeGroupByAcademicProgramHandler;
let repository: AdministrativeGroupRepository;

let getByAcademicProgramSpy: jest.SpyInstance;
let getByAdminUserSpy: jest.SpyInstance;

const adminUser = getAnAdminUser();
adminUser.businessUnits = [getABusinessUnit()];
adminUser.roles = [AdminUserRoles.SUPERADMIN];

const query = new GetAdministrativeGroupByAcademicProgramQuery(
  'academic-program-id',
  'current-administrative-group-id',
  adminUser,
);

const administrativeGroups: AdministrativeGroup[] = [
  getAnAdministrativeGroup(),
  getAnAdministrativeGroup(),
];

describe('GetAdministrativeGroupByAcademicProgramHandler', () => {
  beforeAll(async () => {
    repository = {
      getByAcademicProgram: jest.fn().mockResolvedValue(administrativeGroups),
      getByAdminUser: jest.fn().mockResolvedValue(getAnAdministrativeGroup()),
    } as unknown as AdministrativeGroupRepository;

    getByAcademicProgramSpy = jest.spyOn(repository, 'getByAcademicProgram');
    getByAdminUserSpy = jest.spyOn(repository, 'getByAdminUser');

    handler = new GetAdministrativeGroupByAcademicProgramHandler(repository);
  });

  it('should return administrative groups', async () => {
    const result = await handler.handle(query);

    expect(getByAcademicProgramSpy).toHaveBeenCalledWith(
      'academic-program-id',
      adminUser.businessUnits.map((bu) => bu.id),
      true,
    );

    expect(getByAdminUserSpy).toHaveBeenCalledWith(
      'current-administrative-group-id',
      adminUser.businessUnits.map((bu) => bu.id),
      true,
    );

    const currentAdministrativeGroup = await repository.getByAdminUser(
      'current-administrative-group-id',
      adminUser.businessUnits.map((bu) => bu.id),
      true,
    );

    const filteredResponse = administrativeGroups.filter(
      (ag) =>
        currentAdministrativeGroup &&
        ag.programBlock.id !== currentAdministrativeGroup.programBlock.id,
    );

    expect(result).toEqual(filteredResponse);
  });

  it('should call getByAcademicProgram', async () => {
    await handler.handle(query);

    expect(getByAcademicProgramSpy).toHaveBeenCalledWith(
      'academic-program-id',
      adminUser.businessUnits.map((bu) => bu.id),
      true,
    );
  });

  it('should call getByAdminUser', async () => {
    await handler.handle(query);

    expect(getByAdminUserSpy).toHaveBeenCalledWith(
      'current-administrative-group-id',
      adminUser.businessUnits.map((bu) => bu.id),
      true,
    );
  });

  it('should return the expected administrative groups', async () => {
    const result = await handler.handle(query);

    const currentAdministrativeGroup = await repository.getByAdminUser(
      'current-administrative-group-id',
      adminUser.businessUnits.map((bu) => bu.id),
      true,
    );

    const filteredResponse = administrativeGroups.filter(
      (ag) =>
        currentAdministrativeGroup &&
        ag.programBlock.id !== currentAdministrativeGroup.programBlock.id,
    );

    expect(result).toEqual(filteredResponse);
  });
});
