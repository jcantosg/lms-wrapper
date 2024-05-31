import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetSubjectsByAcademicProgramQuery } from '#academic-offering/applicaton/academic-program/get-subjects-by-academic-program/get-subjects-by-academic-program.query';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

export class GetSubjectsByAcademicProgramHandler implements QueryHandler {
  constructor(private readonly academicProgramGetter: AcademicProgramGetter) {}

  async handle(query: GetSubjectsByAcademicProgramQuery): Promise<Subject[]> {
    const academicProgram = await this.academicProgramGetter.getByAdminUser(
      query.academicProgramId,
      query.adminUser.businessUnits.map((bu) => bu.id),
      query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const subjects: Subject[] = [];
    academicProgram.programBlocks.forEach((block) =>
      subjects.push(...block.subjects),
    );

    return subjects;
  }
}
