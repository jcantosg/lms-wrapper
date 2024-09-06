import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubjectCallScheduleHistory1723458010330
  implements MigrationInterface
{
  name = 'SubjectCallScheduleHistory1723458010330';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "subject_calls_schedule_history" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying, "updated_by_id" character varying, "academic_period_id" character varying, CONSTRAINT "PK_f3cc3e54bbecc5af3c4f842acfe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subject_calls_schedule_history_academic_program" ("subject_calls_schedule_history_id" character varying NOT NULL, "academic_program_id" character varying NOT NULL, CONSTRAINT "PK_023275da3d840ac73c79e377354" PRIMARY KEY ("subject_calls_schedule_history_id", "academic_program_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_32aebf3a4c0e11d31fa6055333" ON "subject_calls_schedule_history_academic_program" ("subject_calls_schedule_history_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_05f06f5790e8c8c71140ffc637" ON "subject_calls_schedule_history_academic_program" ("academic_program_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history" ADD CONSTRAINT "FK_d5ba88cc9c29634ea190808fd24" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history" ADD CONSTRAINT "FK_de89b6d9c8124a3f369b013726d" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history" ADD CONSTRAINT "FK_07a9df02bbb366f8b29cd2c1403" FOREIGN KEY ("academic_period_id") REFERENCES "academic_periods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history_academic_program" ADD CONSTRAINT "FK_32aebf3a4c0e11d31fa60553338" FOREIGN KEY ("subject_calls_schedule_history_id") REFERENCES "subject_calls_schedule_history"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history_academic_program" ADD CONSTRAINT "FK_05f06f5790e8c8c71140ffc6376" FOREIGN KEY ("academic_program_id") REFERENCES "academic_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history_academic_program" DROP CONSTRAINT "FK_05f06f5790e8c8c71140ffc6376"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history_academic_program" DROP CONSTRAINT "FK_32aebf3a4c0e11d31fa60553338"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history" DROP CONSTRAINT "FK_07a9df02bbb366f8b29cd2c1403"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history" DROP CONSTRAINT "FK_de89b6d9c8124a3f369b013726d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject_calls_schedule_history" DROP CONSTRAINT "FK_d5ba88cc9c29634ea190808fd24"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_05f06f5790e8c8c71140ffc637"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_32aebf3a4c0e11d31fa6055333"`,
    );
    await queryRunner.query(
      `DROP TABLE "subject_calls_schedule_history_academic_program"`,
    );
    await queryRunner.query(`DROP TABLE "subject_calls_schedule_history"`);
  }
}
