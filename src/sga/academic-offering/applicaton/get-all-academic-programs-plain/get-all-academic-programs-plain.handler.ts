import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { GetAllAcademicProgramsPlainQuery } from '#academic-offering/applicaton/get-all-academic-programs-plain/get-all-academic-programs-plain.query';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { GetAllAcademicProgramsPlainCriteria } from '#academic-offering/applicaton/get-all-academic-programs-plain/get-all-academic-programs-plain.criteria';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class GetAllAcademicProgramsPlainHandler implements QueryHandler {
  constructor(
    private readonly academicProgramRepository: AcademicProgramRepository,
  ) {}

  async handle(
    query: GetAllAcademicProgramsPlainQuery,
  ): Promise<AcademicProgram[]> {
    const criteria = new GetAllAcademicProgramsPlainCriteria(query);

    return await this.academicProgramRepository.matching(
      criteria,
      query.adminUser.businessUnits,
      query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
  }
}
