import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetStudentAcademicRecordQuery } from './get-student-academic-record.query';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class GetStudentAcademicRecordHandler implements QueryHandler {
  constructor(private readonly academicRecordGetter: AcademicRecordGetter) {}

  async handle(
    query: GetStudentAcademicRecordQuery,
  ): Promise<AcademicRecord[]> {
    return await this.academicRecordGetter.getStudentAcademicRecord(
      query.id,
      query.adminUser.businessUnits.map((bu) => bu.id),
      query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
  }
}
