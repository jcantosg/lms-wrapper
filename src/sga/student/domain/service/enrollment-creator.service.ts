import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';

export class EnrollmentCreator {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly uuidGenerator: UUIDGeneratorService,
  ) {}

  public async createForAcademicRecord(
    academicRecord: AcademicRecord,
  ): Promise<Enrollment[]> {
    const subjects = await this.subjectRepository.getSubjectsByAcademicProgram(
      academicRecord.academicProgram.id,
    );

    const enrollments: Enrollment[] = [];
    subjects.forEach((subject) => {
      const programBlock = subject.programBlocks.find(
        (block) =>
          block.academicProgram.id === academicRecord.academicProgram.id,
      );
      if (!programBlock) {
        throw new ProgramBlockNotFoundException();
      }
      enrollments.push(
        Enrollment.create(
          this.uuidGenerator.generate(),
          subject,
          academicRecord,
          EnrollmentVisibilityEnum.PD,
          EnrollmentTypeEnum.UNIVERSAE,
          programBlock,
          academicRecord.createdBy,
        ),
      );
    });

    return enrollments;
  }
}
