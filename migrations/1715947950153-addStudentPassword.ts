import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStudentPassword1715947950153 implements MigrationInterface {
  name = 'AddStudentPassword1715947950153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students"
      ADD "password" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students"
      DROP COLUMN "password"`);
  }
}
