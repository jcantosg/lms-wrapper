import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetAcademicProgramQuery } from '#academic-offering/applicaton/academic-program/get-academic-program/get-academic-program.query';

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
