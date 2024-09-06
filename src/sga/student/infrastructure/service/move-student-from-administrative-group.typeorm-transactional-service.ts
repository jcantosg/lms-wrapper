import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  MoveStudentFromAdministrativeGroupTransactionalService,
  MoveStudentFromAdministrativeGroupTransactionParams,
} from '#student/domain/service/move-student-from-administrative-group.transactional.service';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';

export class MoveStudentFromAdministrativeGroupTypeormTransactionalService extends MoveStudentFromAdministrativeGroupTransactionalService {
  private logger: Logger;

  constructor(private readonly datasource: DataSource) {
    super();
    this.logger = new Logger(
      MoveStudentFromAdministrativeGroupTransactionalService.name,
    );
  }

  async execute(
    params: MoveStudentFromAdministrativeGroupTransactionParams,
  ): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      this.logger.log('change academic period of academic record');

      await queryRunner.manager.save(AcademicRecord, {
        id: params.academicRecord.id,
        academicPeriod: params.academicRecord.academicPeriod,
        updatedAt: params.academicRecord.updatedAt,
        updatedBy: params.academicRecord.updatedBy,
      });

      this.logger.log('move students from administrative group');
      await queryRunner.manager.save(AdministrativeGroup, {
        id: params.originAdminGroup.id,
        students: params.originAdminGroup.students,
        updatedAt: params.originAdminGroup.updatedAt,
        updatedBy: params.originAdminGroup.updatedBy,
        studentsNumber: params.originAdminGroup.studentsNumber,
      });

      await queryRunner.manager.save(AdministrativeGroup, {
        id: params.destinationAdminGroup.id,
        students: params.destinationAdminGroup.students,
        updatedAt: params.destinationAdminGroup.updatedAt,
        updatedBy: params.destinationAdminGroup.updatedBy,
        studentsNumber: params.destinationAdminGroup.studentsNumber,
      });

      this.logger.log('move students from internal groups');
      for (const group of params.internalGroups) {
        await queryRunner.manager.save(InternalGroup, {
          id: group.id,
          students: group.students,
          updatedAt: group.updatedAt,
          updatedBy: group.updatedBy,
        });
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error to move student from administrative group');
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
