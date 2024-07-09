import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';
import { Student } from '#shared/domain/entity/student.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { StudentAcademicRecordNotFoundException } from '#/student-360/student/domain/exception/student-academic-record-not-found.exception';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';

export class AcademicRecordGetter {
  constructor(private readonly repository: AcademicRecordRepository) {}

  async getByAdminUser(id: string, adminUser: AdminUser) {
    const academicRecord = await this.repository.getByAdminUser(
      id,
      adminUser.businessUnits.map((bu) => bu.id),
      adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    if (!academicRecord) {
      throw new AcademicRecordNotFoundException();
    }

    return academicRecord;
  }

  async get(id: string) {
    const academicRecord = await this.repository.get(id);
    if (!academicRecord) {
      throw new AcademicRecordNotFoundException();
    }

    return academicRecord;
  }

  async getStudentAcademicRecords(
    id: string,
    adminBusinessUnits: string[],
    isSuperAdmin: boolean,
  ) {
    return await this.repository.getStudentAcademicRecords(
      id,
      adminBusinessUnits,
      isSuperAdmin,
    );
  }

  async getStudentAcademicRecord(
    id: string,
    student: Student,
  ): Promise<AcademicRecord> {
    const academicRecord = await this.repository.getByStudent(id, student);

    if (!academicRecord) {
      throw new StudentAcademicRecordNotFoundException();
    }

    academicRecord.academicProgram.programBlocks.map((programBlock) => {
      programBlock.blockRelation =
        this.filterBlockRelationByProgramBlockAndPeriod(
          programBlock.blockRelation,
          programBlock,
          academicRecord.academicPeriod,
        );
    });

    academicRecord.academicProgram.programBlocks.map((programBlock) => {
      programBlock.subjects = programBlock.subjects.filter((subject) => {
        const programBlockStartDate =
          programBlock.blockRelation[0].periodBlock.startDate;
        if (subject.enrollments.length > 0) {
          return subject.enrollments.some(
            (enrollment) =>
              (enrollment.visibility === EnrollmentVisibilityEnum.YES ||
                (enrollment.visibility === EnrollmentVisibilityEnum.PD &&
                  programBlockStartDate <= new Date())) &&
              enrollment.academicRecord.id === academicRecord.id,
          );
        }
      });
    });

    academicRecord.academicProgram.programBlocks.sort(
      (firstProgramBlock: ProgramBlock, secondProgramBlock: ProgramBlock) => {
        if (
          firstProgramBlock.blockRelation[0].periodBlock.startDate <
          secondProgramBlock.blockRelation[0].periodBlock.startDate
        ) {
          return -1;
        } else if (
          firstProgramBlock.blockRelation[0].periodBlock.startDate >
          secondProgramBlock.blockRelation[0].periodBlock.startDate
        ) {
          return 1;
        } else {
          return 0;
        }
      },
    );

    return academicRecord;
  }

  private filterBlockRelationByProgramBlockAndPeriod(
    blockRelation: BlockRelation[],
    programBlock: ProgramBlock,
    academicPeriod: AcademicPeriod,
  ) {
    return blockRelation.filter((blockRelation) => {
      return (
        blockRelation.programBlock.id === programBlock.id &&
        blockRelation.periodBlock.academicPeriod.id === academicPeriod.id
      );
    });
  }
}
