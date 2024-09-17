import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { SubjectUpToBlockGetter } from '#academic-offering/domain/service/subject/subject-up-to-block-getter.service';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { StudentAdministrativeGroupStatusEnum } from '#student/domain/enum/student-administrative-group-status.enum';

export class AdministrativeGroupStatusStudentGetter {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly subjectUpToBlockGetter: SubjectUpToBlockGetter,
  ) {}

  async getStatus(
    academicRecord: AcademicRecord,
    administrativeGroup: AdministrativeGroup,
  ): Promise<StudentAdministrativeGroupStatusEnum> {
    const subjectsToCheck = (
      await this.subjectUpToBlockGetter.getSubjectsUpToBlock(
        administrativeGroup.programBlock.id,
      )
    ).filter((subject) => subject.evaluationType?.name !== 'No Evaluable');

    const enrollments = (
      await this.enrollmentRepository.getByAcademicRecord(academicRecord)
    ).filter(
      (enrollment) =>
        enrollment.subject.evaluationType?.name !== 'No Evaluable',
    );

    if (enrollments.length === 0 || subjectsToCheck.length === 0) {
      return StudentAdministrativeGroupStatusEnum.PENDING;
    }

    for (const subjectToCheck of subjectsToCheck) {
      const enrollment = enrollments.find(
        (enrollment) => enrollment.subject.id === subjectToCheck.id,
      );

      if (!enrollment) {
        return StudentAdministrativeGroupStatusEnum.PENDING;
      }

      if (!this.hasPassedSubject(enrollment)) {
        return StudentAdministrativeGroupStatusEnum.PENDING;
      }
    }

    return StudentAdministrativeGroupStatusEnum.FINISH;
  }

  private hasPassedSubject(enrollment: Enrollment): boolean {
    if (enrollment.type !== EnrollmentTypeEnum.UNIVERSAE) {
      return true;
    }

    const lastCall = enrollment.getLastCall();

    return !!(lastCall && lastCall.status === SubjectCallStatusEnum.PASSED);
  }
}
