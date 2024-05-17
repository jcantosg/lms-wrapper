import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStartMonthAndAcademicYearToPeriodBlock1715766626420
  implements MigrationInterface
{
  name = 'AddStartMonthAndAcademicYearToPeriodBlock1715766626420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."period_blocks_start_month_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11')`,
    );
    await queryRunner.query(
      `ALTER TABLE "period_blocks" ADD "start_month" "public"."period_blocks_start_month_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "period_blocks" ADD "academic_year" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "period_blocks" DROP COLUMN "academic_year"`,
    );
    await queryRunner.query(
      `ALTER TABLE "period_blocks" DROP COLUMN "start_month"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."period_blocks_start_month_enum"`,
    );
  }
}
