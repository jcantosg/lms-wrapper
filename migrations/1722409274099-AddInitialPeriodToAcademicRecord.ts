import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInitialPeriodToAcademicRecord1722409274099
  implements MigrationInterface
{
  name = 'AddInitialPeriodToAcademicRecord1722409274099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD "initial_academic_period_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD CONSTRAINT "FK_e91f1056bdbaed4c2d08c70b7a7" FOREIGN KEY ("initial_academic_period_id") REFERENCES "academic_periods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `UPDATE "academic_records" SET "initial_academic_period_id" = "academic_period_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "academic_records" DROP CONSTRAINT "FK_e91f1056bdbaed4c2d08c70b7a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" DROP COLUMN "initial_academic_period_id"`,
    );
  }
}
