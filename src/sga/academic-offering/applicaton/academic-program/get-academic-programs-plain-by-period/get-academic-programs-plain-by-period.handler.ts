import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetAcademicProgramsPlainByPeriodQuery } from '#academic-offering/applicaton/academic-program/get-academic-programs-plain-by-period/get-academic-programs-plain-by-period.query';

export class GetAcademicProgramsPlainByPeriodHandler implements QueryHandler {
  constructor(
    private readonly academicProgramRepository: AcademicProgramRepository,
    private readonly academicPeriodGetter: AcademicPeriodGetter,
  ) {}

  async handle(query: GetAcademicProgramsPlainByPeriodQuery) {
    const academicPeriod = await this.academicPeriodGetter.getByAdminUser(
      query.academicPeriodId,
      query.adminUser.businessUnits.map((bu) => bu.id),
      query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    return this.academicProgramRepository.getByAcademicPeriod(
      academicPeriod.id,
    );
  }
}
