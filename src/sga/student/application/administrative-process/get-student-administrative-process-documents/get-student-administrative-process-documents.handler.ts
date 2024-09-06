import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { GetStudentAdministrativeProcessDocumentsQuery } from '#student/application/administrative-process/get-student-administrative-process-documents/get-student-administrative-process-documents.query';

export class GetStudentAdministrativeProcessDocumentsHandler
  implements QueryHandler
{
  constructor(
    private readonly repository: AdministrativeProcessRepository,
    private readonly studentGetter: StudentGetter,
    private readonly academicRecordGetter: AcademicRecordGetter,
  ) {}

  async handle(
    query: GetStudentAdministrativeProcessDocumentsQuery,
  ): Promise<AdministrativeProcess[]> {
    const student = await this.studentGetter.get(query.studentId);
    const academicRecords =
      await this.academicRecordGetter.getStudentAcademicRecords(
        query.studentId,
        query.adminUser.businessUnits.map((bu) => bu.id),
        query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      );

    const academicRecordAdminProcesses: AdministrativeProcess[] = [];
    const adminProcesses = await this.repository.getByStudent(student.id);

    await Promise.all([
      academicRecords.forEach(async (ar) => {
        academicRecordAdminProcesses.push(
          ...(await this.repository.getByAcademicRecord(ar.id)),
        );
      }),
    ]);
    adminProcesses.push(...academicRecordAdminProcesses);

    return adminProcesses.reduce(
      (
        accumulator: AdministrativeProcess[],
        current: AdministrativeProcess,
      ) => {
        if (!accumulator.find((ap) => ap.id === current.id)) {
          accumulator.push(current);
        }

        return accumulator;
      },
      [],
    );
  }
}
