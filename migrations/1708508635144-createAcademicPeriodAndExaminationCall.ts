import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAcademicPeriodAndExaminationCall1708508635144
  implements MigrationInterface
{
  name = 'CreateAcademicPeriodAndExaminationCall1708508635144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "academic_periods"
                             (
                               "id"               character varying NOT NULL,
                               "created_at"       TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"       TIMESTAMP         NOT NULL DEFAULT now(),
                               "name"             character varying NOT NULL,
                               "code"             character varying NOT NULL,
                               "start_date"       TIMESTAMP         NOT NULL,
                               "end_date"         TIMESTAMP         NOT NULL,
                               "blocks_number"    integer           NOT NULL,
                               "created_by_id"    character varying,
                               "updated_by_id"    character varying,
                               "business_unit_id" character varying,
                               CONSTRAINT "UQ_51e51a2c82740735cff0bdf6b0d" UNIQUE ("code"),
                               CONSTRAINT "PK_911f414fba24e3855a5ba1f51ad" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(
      `CREATE TYPE "public"."examination_calls_timezone_enum" AS ENUM('GMT', 'GMT+1', 'GMT+2', 'GMT+3', 'GMT+4', 'GMT+5', 'GMT+6', 'GMT+7', 'GMT+8', 'GMT+9', 'GMT+10', 'GMT+11', 'GMT+12')`,
    );
    await queryRunner.query(`CREATE TABLE "examination_calls"
                             (
                               "id"                 character varying                          NOT NULL,
                               "created_at"         TIMESTAMP                                  NOT NULL DEFAULT now(),
                               "updated_at"         TIMESTAMP                                  NOT NULL DEFAULT now(),
                               "name"               character varying                          NOT NULL,
                               "start_date"         TIMESTAMP                                  NOT NULL,
                               "end_date"           TIMESTAMP                                  NOT NULL,
                               "timezone"           "public"."examination_calls_timezone_enum" NOT NULL,
                               "academic_period_id" character varying,
                               CONSTRAINT "PK_7fa8646c644eec3ac7a6bb9312f" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "academic_periods"
      ADD CONSTRAINT "FK_fd2d0073abfc0f3421edbb48b96" FOREIGN KEY ("created_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "academic_periods"
      ADD CONSTRAINT "FK_330e1ee1ab9b09c028ee77536ff" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "academic_periods"
      ADD CONSTRAINT "FK_53ad73dc22c16e4f19aa85823eb" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "examination_calls"
      ADD CONSTRAINT "FK_41554b4f89266349b157e27f96a" FOREIGN KEY ("academic_period_id") REFERENCES "academic_periods" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "examination_calls"
      DROP CONSTRAINT "FK_41554b4f89266349b157e27f96a"`);
    await queryRunner.query(`ALTER TABLE "academic_periods"
      DROP CONSTRAINT "FK_53ad73dc22c16e4f19aa85823eb"`);
    await queryRunner.query(`ALTER TABLE "academic_periods"
      DROP CONSTRAINT "FK_330e1ee1ab9b09c028ee77536ff"`);
    await queryRunner.query(`ALTER TABLE "academic_periods"
      DROP CONSTRAINT "FK_fd2d0073abfc0f3421edbb48b96"`);
    await queryRunner.query(`DROP TABLE "examination_calls"`);
    await queryRunner.query(
      `DROP TYPE "public"."examination_calls_timezone_enum"`,
    );
    await queryRunner.query(`DROP TABLE "academic_periods"`);
  }
}
