import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEnrollmentAndSubjectCallEntities1715090088888
  implements MigrationInterface
{
  name = 'AddEnrollmentAndSubjectCallEntities1715090088888';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "enrollments"
                             (
                               "id"                 character varying NOT NULL,
                               "created_at"         TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"         TIMESTAMP         NOT NULL DEFAULT now(),
                               "visibility"         character varying NOT NULL,
                               "type"               character varying NOT NULL,
                               "max_calls"          integer           NOT NULL,
                               "created_by_id"      character varying,
                               "updated_by_id"      character varying,
                               "subject_id"         character varying,
                               "academic_record_id" character varying,
                               "program_block_id"   character varying,
                               CONSTRAINT "PK_7c0f752f9fb68bf6ed7367ab00f" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "subject_calls"
                             (
                               "id"            character varying NOT NULL,
                               "created_at"    TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"    TIMESTAMP         NOT NULL DEFAULT now(),
                               "call_number"   integer           NOT NULL DEFAULT '0',
                               "call_date"     TIMESTAMP         NOT NULL,
                               "final_grade"   character varying NOT NULL,
                               "status"        character varying NOT NULL,
                               "created_by_id" character varying,
                               "updated_by_id" character varying,
                               "enrollment_id" character varying,
                               CONSTRAINT "PK_c93f734057d183268b38679db29" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "enrollments"
      ADD CONSTRAINT "FK_198b39410fbed6f6b9ff8eb2c46" FOREIGN KEY ("created_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "enrollments"
      ADD CONSTRAINT "FK_e677dc51388ce02c1b014717e3d" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "enrollments"
      ADD CONSTRAINT "FK_931f4e1d2848270a4ec594bda59" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "enrollments"
      ADD CONSTRAINT "FK_ec0017f19d9cbc849bc0c1c7cf3" FOREIGN KEY ("academic_record_id") REFERENCES "academic_records" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "enrollments"
      ADD CONSTRAINT "FK_9d00d6deaab5c01a40c131f2f3c" FOREIGN KEY ("program_block_id") REFERENCES "program_blocks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "subject_calls"
      ADD CONSTRAINT "FK_684205eb10d4bcf7826447cc183" FOREIGN KEY ("created_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "subject_calls"
      ADD CONSTRAINT "FK_71de9c002537fd88ec215fba941" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "subject_calls"
      ADD CONSTRAINT "FK_6029f94695d5fa77721b55fb25c" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subject_calls"
      DROP CONSTRAINT "FK_6029f94695d5fa77721b55fb25c"`);
    await queryRunner.query(`ALTER TABLE "subject_calls"
      DROP CONSTRAINT "FK_71de9c002537fd88ec215fba941"`);
    await queryRunner.query(`ALTER TABLE "subject_calls"
      DROP CONSTRAINT "FK_684205eb10d4bcf7826447cc183"`);
    await queryRunner.query(`ALTER TABLE "enrollments"
      DROP CONSTRAINT "FK_9d00d6deaab5c01a40c131f2f3c"`);
    await queryRunner.query(`ALTER TABLE "enrollments"
      DROP CONSTRAINT "FK_ec0017f19d9cbc849bc0c1c7cf3"`);
    await queryRunner.query(`ALTER TABLE "enrollments"
      DROP CONSTRAINT "FK_931f4e1d2848270a4ec594bda59"`);
    await queryRunner.query(`ALTER TABLE "enrollments"
      DROP CONSTRAINT "FK_e677dc51388ce02c1b014717e3d"`);
    await queryRunner.query(`ALTER TABLE "enrollments"
      DROP CONSTRAINT "FK_198b39410fbed6f6b9ff8eb2c46"`);
    await queryRunner.query(`DROP TABLE "subject_calls"`);
    await queryRunner.query(`DROP TABLE "enrollments"`);
  }
}
