import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { Student } from '#shared/domain/entity/student.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class UpdateInternalGroupsService {
  constructor(private readonly repository: InternalGroupRepository) {}

  public async update(
    student: Student,
    enrollments: Enrollment[],
    academicPeriod: AcademicPeriod,
    academicProgram: AcademicProgram,
    adminUser: AdminUser,
  ): Promise<InternalGroup[]> {
    const internalGroups: InternalGroup[] = [];

    const existentInternalGroups: InternalGroup[] =
      await this.repository.getAllByStudent(student.id);

    for (const group of existentInternalGroups) {
      group.removeStudent(student);
      group.updatedAt = new Date();
      group.updatedBy = adminUser;
      internalGroups.push(group);
    }

    for (const enrollment of enrollments) {
      const groups = await this.repository.getByKeys(
        academicPeriod,
        academicProgram,
        enrollment.subject,
      );
      const defaultGroup = groups.find((group) => group.isDefault);
      if (defaultGroup) {
        defaultGroup.addStudents([student]);
        defaultGroup.updatedAt = new Date();
        defaultGroup.updatedBy = adminUser;
        internalGroups.push(defaultGroup);
      }
    }

    return internalGroups;
  }
}
