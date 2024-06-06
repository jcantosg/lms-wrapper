import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLmsCourseToSubject1717403571426 implements MigrationInterface {
  name = 'AddLmsCourseToSubject1717403571426';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subjects"
      ADD "lms_course" json`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subjects"
      DROP COLUMN "lms_course"`);
  }
}
