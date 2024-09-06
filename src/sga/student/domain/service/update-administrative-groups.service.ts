import { Student } from '#shared/domain/entity/student.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AdministrativeGroupNotFoundException } from '#shared/domain/exception/administrative-group/administrative-group.not-found.exception';

export class UpdateAdministrativeGroupsService {
  constructor(private readonly repository: AdministrativeGroupRepository) {}

  public async update(
    student: Student,
    oldAcademicRecord: AcademicRecord | null,
    newAcademicRecord: AcademicRecord,
    adminUser: AdminUser,
  ): Promise<AdministrativeGroup[]> {
    const administrativeGroups: AdministrativeGroup[] = [];

    if (oldAcademicRecord) {
      const existentAdministrativeGroups: AdministrativeGroup[] =
        await this.repository.getByStudentAndAcademicPeriodAndAcademicProgram(
          student.id,
          oldAcademicRecord.academicPeriod.id,
          oldAcademicRecord.academicProgram.id,
        );

      for (const group of existentAdministrativeGroups) {
        group.removeStudent(student);
        group.updatedAt = new Date();
        group.updatedBy = adminUser;
        administrativeGroups.push(group);
      }
    }

    const newAdministrativeGroup: AdministrativeGroup | null =
      await this.repository.getByAcademicPeriodAndProgramAndFirstBlock(
        newAcademicRecord.academicPeriod.id,
        newAcademicRecord.academicProgram.id,
      );

    if (!newAdministrativeGroup) {
      throw new AdministrativeGroupNotFoundException();
    }

    newAdministrativeGroup.addStudent(student);
    newAdministrativeGroup.updatedAt = new Date();
    newAdministrativeGroup.updatedBy = adminUser;
    administrativeGroups.push(newAdministrativeGroup);

    return administrativeGroups;
  }
}
