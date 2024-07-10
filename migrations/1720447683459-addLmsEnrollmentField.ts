import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLmsEnrollmentField1720447683459 implements MigrationInterface {
  name = 'AddLmsEnrollmentField1720447683459';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "enrollments"
      ADD "lms_enrollment" json DEFAULT '{}'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "enrollments"
      DROP COLUMN "lms_enrollment"`);
  }
}
