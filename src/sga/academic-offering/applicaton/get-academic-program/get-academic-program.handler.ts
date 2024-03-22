import { GetAcademicProgramQuery } from '#academic-offering/applicaton/get-academic-program/get-academic-program.query';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program-getter.service';
import { QueryHandler } from '#shared/domain/bus/query.handler';

export class GetAcademicProgramHandler implements QueryHandler {
  constructor(private readonly academicProgramGetter: AcademicProgramGetter) {}

  async handle(query: GetAcademicProgramQuery): Promise<AcademicProgram> {
    return await this.academicProgramGetter.getByAdminUser(
      query.id,
      query.adminUserBusinessUnits,
      query.isSuperAdmin,
    );
  }
}
