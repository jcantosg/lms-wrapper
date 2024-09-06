import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';

export class StudentAdministrativeGroupByAcademicRecordGetter {
  constructor(
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly studentGetter: StudentGetter,
    private readonly administrativeGroupRepository: AdministrativeGroupRepository,
  ) {}

  async get(academicRecordId: string): Promise<AdministrativeGroup | null> {
    const academicRecord =
      await this.academicRecordGetter.get(academicRecordId);

    const student = await this.studentGetter.get(academicRecord.student.id);

    const administrativeGroup = student.administrativeGroups.find(
      (adminGroup) =>
        adminGroup.academicProgram.title.id ===
        academicRecord.academicProgram.title.id,
    );

    return administrativeGroup
      ? await this.administrativeGroupRepository.get(administrativeGroup.id)
      : null;
  }
}
