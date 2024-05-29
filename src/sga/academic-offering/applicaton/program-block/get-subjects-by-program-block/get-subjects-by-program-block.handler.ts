import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetSubjectsByProgramBlockQuery } from '#academic-offering/applicaton/program-block/get-subjects-by-program-block/get-subjects-by-program-block.query';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { GetSubjectsByProgramBlockCriteria } from '#academic-offering/applicaton/program-block/get-subjects-by-program-block/get-subjects-by-program-block.criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class GetSubjectsByProgramBlockHandler implements QueryHandler {
  constructor(
    private readonly programBlockGetter: ProgramBlockGetter,
    private readonly subjectRepository: SubjectRepository,
  ) {}

  async handle(query: GetSubjectsByProgramBlockQuery): Promise<Subject[]> {
    await this.programBlockGetter.getByAdminUser(
      query.blockId,
      query.adminUser,
    );

    const criteria = new GetSubjectsByProgramBlockCriteria(query);

    return await this.subjectRepository.matching(
      criteria,
      query.adminUser.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
  }
}
