import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetStudentAcademicRecordQuery } from './get-student-academic-record.query';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';
import { StudentGetter } from '#shared/domain/service/student-getter.service';

export class GetStudentAcademicRecordHandler implements QueryHandler {
  constructor(
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly studentGetter: StudentGetter,
  ) {}

  async handle(
    query: GetStudentAcademicRecordQuery,
  ): Promise<AcademicRecord[]> {
    if (!(await this.studentGetter.get(query.id))) {
      throw new StudentNotFoundException();
    }

    return await this.academicRecordGetter.getStudentAcademicRecords(
      query.id,
      query.adminUser.businessUnits.map((bu) => bu.id),
      query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
  }
}
