import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { GetSpecialtiesByAcademicProgramQuery } from '#academic-offering/applicaton/academic-program/get-specialties-by-academic-program/get-specialties-by-academic-program.query';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';

export class GetSpecialtiesByAcademicProgramHandler implements QueryHandler {
  constructor(private readonly academicProgramGetter: AcademicProgramGetter) {}

  async handle(
    query: GetSpecialtiesByAcademicProgramQuery,
  ): Promise<Subject[]> {
    const academicProgram = await this.academicProgramGetter.getByAdminUser(
      query.academicProgramId,
      query.adminUser.businessUnits.map((bu) => bu.id),
      query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const subjects: Subject[] = [];
    academicProgram.programBlocks.forEach((block) =>
      subjects.push(...block.subjects),
    );

    return subjects.filter((subject) => subject.type === SubjectType.SPECIALTY);
  }
}
