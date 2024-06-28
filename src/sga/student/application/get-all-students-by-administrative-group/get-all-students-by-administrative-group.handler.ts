import { QueryHandler } from '#shared/domain/bus/query.handler';
import { StudentRepository } from '#/student-360/student/domain/repository/student.repository';
import { Student } from '#shared/domain/entity/student.entity';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { GetAllStudentsByAdministrativeGroupCriteria } from '#student/application/get-all-students-by-administrative-group/get-all-students-by-administrative-group.criteria';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { GetAllStudentsByAdministrativeGroupQuery } from '#student/application/get-all-students-by-administrative-group/get-all-students-by-administrative-group.query';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { AdministrativeGroupStatusStudentGetter } from '#student/domain/service/administrative-group-status-student.getter.service';
import { StudentAdministrativeGroupStatusEnum } from '#student/domain/enum/student-administrative-group-status.enum';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';

export type StudentAdministrativeGroup = {
  student: Student;
  academicRecord: AcademicRecord;
  status: StudentAdministrativeGroupStatusEnum;
};

export class GetAllStudentsByAdministrativeGroupHandler
  implements QueryHandler
{
  constructor(
    private readonly studentsRepository: StudentRepository,
    private readonly academicRecordRepository: AcademicRecordRepository,
    private readonly administrativeGroupGetter: AdministrativeGroupGetter,
    private readonly administrativeGroupStatusStudentGetter: AdministrativeGroupStatusStudentGetter,
  ) {}

  async handle(
    query: GetAllStudentsByAdministrativeGroupQuery,
  ): Promise<CollectionHandlerResponse<StudentAdministrativeGroup>> {
    const criteria = new GetAllStudentsByAdministrativeGroupCriteria(query);
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
          if (!academicRecord) {
            throw new AcademicRecordNotFoundException();
          }
          const status =
            await this.administrativeGroupStatusStudentGetter.getStatus(
              academicRecord,
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
