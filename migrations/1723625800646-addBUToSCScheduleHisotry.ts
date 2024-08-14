import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBUToSCScheduleHisotry1723625800646
  implements MigrationInterface
{
  name = 'AddBUToSCScheduleHisotry1723625800646';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history" ADD "business_unit_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history" ADD CONSTRAINT "FK_48fd33a7302c5f603f3fe3ae15c" FOREIGN KEY ("business_unit_id") REFERENCES "business_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history" DROP CONSTRAINT "FK_48fd33a7302c5f603f3fe3ae15c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history" DROP COLUMN "business_unit_id"`,
    );
  }
}
