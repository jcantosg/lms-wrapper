import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAcademicProgramsToAcademicPeriod1711969654008
  implements MigrationInterface
{
  name = 'AddAcademicProgramsToAcademicPeriod1711969654008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "academic_periods_academic_programs"
                             (
                               "academic_period_id"  character varying NOT NULL,
                               "academic_program_id" character varying NOT NULL,
                               CONSTRAINT "PK_5af93b6d447b1a55ea965e998aa" PRIMARY KEY ("academic_period_id", "academic_program_id")
                             )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_acae1dea47297af26c3b928973" ON "academic_periods_academic_programs" ("academic_period_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1740db7df3cbad9e49797e3f0d" ON "academic_periods_academic_programs" ("academic_program_id") `,
    );
    await queryRunner.query(`ALTER TABLE "academic_periods_academic_programs"
      ADD CONSTRAINT "FK_acae1dea47297af26c3b9289734" FOREIGN KEY ("academic_period_id") REFERENCES "academic_periods" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "academic_periods_academic_programs"
      ADD CONSTRAINT "FK_1740db7df3cbad9e49797e3f0d5" FOREIGN KEY ("academic_program_id") REFERENCES "academic_programs" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "academic_periods_academic_programs"
      DROP CONSTRAINT "FK_1740db7df3cbad9e49797e3f0d5"`);
    await queryRunner.query(`ALTER TABLE "academic_periods_academic_programs"
      DROP CONSTRAINT "FK_acae1dea47297af26c3b9289734"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1740db7df3cbad9e49797e3f0d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_acae1dea47297af26c3b928973"`,
    );
    await queryRunner.query(`DROP TABLE "academic_periods_academic_programs"`);
  }
}
