import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetStudentAcademicRecordQuery } from './get-student-academic-record.query';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { AcademicRecordProcess } from '#student/infrastructure/controller/academic-record/get-student-academic-record.response';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';

export class GetStudentAcademicRecordHandler implements QueryHandler {
  constructor(
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly studentGetter: StudentGetter,
    private readonly administrativeProcesssRepository: AdministrativeProcessRepository,
  ) {}

  async handle(
    query: GetStudentAcademicRecordQuery,
  ): Promise<AcademicRecordProcess[]> {
    if (!(await this.studentGetter.get(query.id))) {
      throw new StudentNotFoundException();
    }

    const academicRecordProcesses: AcademicRecordProcess[] = [];

    const academicRecords =
      await this.academicRecordGetter.getStudentAcademicRecords(
        query.id,
        query.adminUser.businessUnits.map((bu) => bu.id),
        query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      );

    for (const ar of academicRecords) {
      const adminProcesses =
        await this.administrativeProcesssRepository.getByAcademicRecord(ar.id);
      academicRecordProcesses.push({
        record: ar,
        administrativeProcess:
          adminProcesses.find(
            (ap) =>
              ap.type === AdministrativeProcessTypeEnum.NEW_ACADEMIC_RECORD,
          ) ?? null,
      });
    }

    return academicRecordProcesses;
  }
}
