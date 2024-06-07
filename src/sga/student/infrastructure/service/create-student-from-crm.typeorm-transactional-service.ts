import {
  CreateStudentFromCRMTransactionParams,
  CreateStudentFromCRMTransactionalService,
} from '#student/domain/service/create-student-from-crm.transactional-service';
import { DataSource } from 'typeorm';

export class CreateStudentFromCRMTypeormTransactionalService extends CreateStudentFromCRMTransactionalService {
  constructor(private readonly datasource: DataSource) {
    super();
  }

  async execute(
    entities: CreateStudentFromCRMTransactionParams,
  ): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(entities.student);
      await queryRunner.manager.save(entities.academicRecord);
      await Promise.all([
        entities.enrollments.forEach(
          async (enrollment) => await queryRunner.manager.save(enrollment),
        ),
      ]);

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
