import { StudentRepository } from '#/student/student/domain/repository/student.repository';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { AdministrativeGroupStatusStudentGetter } from '#student/domain/service/administrative-group-status-student.getter.service';
import { SearchStudentsByAdministrativeGroupQuery } from '#student/application/search-students-by-administrative-group/search-students-by-administrative-group.query';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { StudentAdministrativeGroup } from '#student/application/get-all-students-by-administrative-group/get-all-students-by-administrative-group.handler';
import { SearchStudentsByAdministrativeGroupCriteria } from '#student/application/search-students-by-administrative-group/search-students-by-administrative-group.criteria';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Student } from '#shared/domain/entity/student.entity';

export class SearchStudentsByAdministrativeGroupHandler {
  constructor(
    private readonly studentsRepository: StudentRepository,
    private readonly academicRecordRepository: AcademicRecordRepository,
    private readonly administrativeGroupGetter: AdministrativeGroupGetter,
    private readonly administrativeGroupStatusStudentGetter: AdministrativeGroupStatusStudentGetter,
  ) {}
  async handle(
    query: SearchStudentsByAdministrativeGroupQuery,
  ): Promise<CollectionHandlerResponse<StudentAdministrativeGroup>> {
    const criteria = new SearchStudentsByAdministrativeGroupCriteria(query);
    const administrativeGroup =
      await this.administrativeGroupGetter.getByAdminUser(
        query.administrativeGroupId,
        query.adminUser,
      );

    const [total, students] = await Promise.all([
      this.studentsRepository.count(
        criteria,
        query.adminUser.businessUnits,
        query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      ),
      this.studentsRepository.matching(
        criteria,
        query.adminUser.businessUnits,
        query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      ),
    ]);

    const studentsAdministrativeGroup: StudentAdministrativeGroup[] =
      await Promise.all(
        students.map(async (student: Student) => {
          const academicRecord =
            await this.academicRecordRepository.getStudentAcademicRecordByPeriodAndProgram(
              student.id,
              administrativeGroup.academicPeriod.id,
              administrativeGroup.academicProgram.id,
            );

          const status =
            await this.administrativeGroupStatusStudentGetter.getStatus(
              academicRecord!,
              administrativeGroup,
            );

          return {
            student: student,
            academicRecord: academicRecord!,
            status: status,
          };
        }),
      );

    return {
      total: total,
      items: studentsAdministrativeGroup,
    };
  }
}
