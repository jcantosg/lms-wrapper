import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLmsStudent1717759577569 implements MigrationInterface {
  name = 'AddLmsStudent1717759577569';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" ADD "lms_student" json DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "lms_student"`);
  }
}
