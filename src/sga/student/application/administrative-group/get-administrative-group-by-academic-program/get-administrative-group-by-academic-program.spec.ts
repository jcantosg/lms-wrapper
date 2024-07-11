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

const adminUser = getAnAdminUser();
adminUser.businessUnits = [getABusinessUnit()];
adminUser.roles = [AdminUserRoles.SUPERADMIN];

const query = new GetAdministrativeGroupByAcademicProgramQuery(
  'academic-program-id',
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
    } as unknown as AdministrativeGroupRepository;

    getByAcademicProgramSpy = jest.spyOn(repository, 'getByAcademicProgram');

    handler = new GetAdministrativeGroupByAcademicProgramHandler(repository);
  });

  it('should return administrative groups', async () => {
    const result = await handler.handle(query);

    expect(getByAcademicProgramSpy).toHaveBeenCalledWith(
      'academic-program-id',
      adminUser.businessUnits.map((bu) => bu.id),
      true,
    );

    expect(result).toEqual(administrativeGroups);
  });

  it('should call getByAcademicProgram', async () => {
    await handler.handle(query);

    expect(getByAcademicProgramSpy).toHaveBeenCalledWith(
      'academic-program-id',
      adminUser.businessUnits.map((bu) => bu.id),
      true,
    );
  });

  it('should return the expected administrative groups', async () => {
    const result = await handler.handle(query);

    expect(result).toEqual(administrativeGroups);
  });
});
