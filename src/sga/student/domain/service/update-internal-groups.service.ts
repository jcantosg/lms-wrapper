import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { Student } from '#shared/domain/entity/student.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';

export class UpdateInternalGroupsService {
  constructor(private readonly repository: InternalGroupRepository) {}

  public async update(
    student: Student,
    oldAcademicRecord: AcademicRecord | null,
    enrollments: Enrollment[],
    academicPeriod: AcademicPeriod,
    academicProgram: AcademicProgram,
    adminUser: AdminUser,
  ): Promise<InternalGroup[]> {
    const internalGroups: InternalGroup[] = [];

    if (oldAcademicRecord) {
      const existentInternalGroups: InternalGroup[] =
        await this.repository.getAllByStudentAndKeys(
          student.id,
          oldAcademicRecord.academicPeriod,
          oldAcademicRecord.academicProgram,
        );

      for (const group of existentInternalGroups) {
        group.removeStudent(student);
        group.updatedAt = new Date();
        group.updatedBy = adminUser;
        internalGroups.push(group);
      }
    }

    const validEnrollments = enrollments.filter(
      (enrollment) => enrollment.subject.type !== SubjectType.SPECIALTY,
    );
    for (const enrollment of validEnrollments) {
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
