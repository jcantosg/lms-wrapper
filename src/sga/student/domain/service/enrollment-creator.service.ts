import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';

export class EnrollmentCreator {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly uuidGenerator: UUIDGeneratorService,
  ) {}

  public async createForAcademicRecord(
    academicRecord: AcademicRecord,
    adminUser: AdminUser,
  ): Promise<Enrollment[]> {
    const subjects = (
      await this.subjectRepository.getSubjectsByAcademicProgram(
        academicRecord.academicProgram.id,
      )
    ).filter((subject) => subject.type !== SubjectType.ELECTIVE);

    const enrollments: Enrollment[] = [];
    subjects.forEach((subject) => {
      const programBlock = subject.programBlocks.find(
        (block) =>
          block.academicProgram.id === academicRecord.academicProgram.id,
      );
      if (!programBlock) {
        throw new ProgramBlockNotFoundException();
      }

      const enrollment = Enrollment.create(
        this.uuidGenerator.generate(),
        subject,
        academicRecord,
        EnrollmentVisibilityEnum.PD,
        EnrollmentTypeEnum.UNIVERSAE,
        programBlock,
        academicRecord.createdBy,
      );

      const subjectCall = SubjectCall.create(
        this.uuidGenerator.generate(),
        enrollment,
        1,
        new Date(),
        SubjectCallFinalGradeEnum.ONGOING,
        SubjectCallStatusEnum.ONGOING,
        adminUser,
      );
      enrollment.addSubjectCall(subjectCall);

      enrollments.push(enrollment);
    });

    return enrollments;
  }
}
