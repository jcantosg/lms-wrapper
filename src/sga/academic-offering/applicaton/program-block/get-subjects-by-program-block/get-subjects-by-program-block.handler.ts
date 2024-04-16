import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetSubjectsByProgramBlockQuery } from '#academic-offering/applicaton/program-block/get-subjects-by-program-block/get-subjects-by-program-block.query';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

export class GetSubjectsByProgramBlockHandler implements QueryHandler {
  constructor(private readonly programBlockGetter: ProgramBlockGetter) {}

  async handle(query: GetSubjectsByProgramBlockQuery): Promise<Subject[]> {
    const block = await this.programBlockGetter.getByAdminUser(
      query.blockId,
      query.adminUser,
    );

    return block.subjects;
  }
}
