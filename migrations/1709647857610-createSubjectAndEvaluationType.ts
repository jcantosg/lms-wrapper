import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubjectAndEvaluationType1709647857610
  implements MigrationInterface
{
  name = 'CreateSubjectAndEvaluationType1709647857610';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "evaluation_types"
                             (
                               "id"                        character varying NOT NULL,
                               "created_at"                TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"                TIMESTAMP         NOT NULL DEFAULT now(),
                               "name"                      character varying NOT NULL,
                               "percentage_virtual_campus" double precision  NOT NULL,
                               "percentage_attendance"     double precision  NOT NULL,
                               "percentage_project"        double precision  NOT NULL,
                               "is_passed"                 boolean           NOT NULL DEFAULT true,
                               "created_by_id"             character varying,
                               "updated_by_id"             character varying,
                               CONSTRAINT "PK_22a720bee86c674ca2be66de232" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(
      `CREATE TYPE "public"."subjects_modality_enum" AS ENUM('e-learning', 'mixta', 'presencial')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subjects_type_enum" AS ENUM('asignatura', 'Trabajo Fin de Grado/Máster', 'practica')`,
    );
    await queryRunner.query(`CREATE TABLE "subjects"
                             (
                               "id"                 character varying                 NOT NULL,
                               "created_at"         TIMESTAMP                         NOT NULL DEFAULT now(),
                               "updated_at"         TIMESTAMP                         NOT NULL DEFAULT now(),
                               "image"              character varying,
                               "name"               character varying                 NOT NULL,
                               "code"               character varying                 NOT NULL,
                               "official_code"      character varying                 NOT NULL,
                               "hours"              integer                           NOT NULL,
                               "modality"           "public"."subjects_modality_enum" NOT NULL,
                               "type"               "public"."subjects_type_enum"     NOT NULL,
                               "is_regulated"       boolean                           NOT NULL DEFAULT true,
                               "is_core"            boolean                           NOT NULL DEFAULT true,
                               "created_by_id"      character varying,
                               "updated_by_id"      character varying,
                               "evaluation_type_id" character varying,
                               "business_unit_id"   character varying,
                               CONSTRAINT "UQ_542cbba74dde3c82ab49c573109" UNIQUE ("code"),
                               CONSTRAINT "PK_1a023685ac2b051b4e557b0b280" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "evaluation_type_business_units"
                             (
                               "evaluation_type_id" character varying NOT NULL,
                               "business_unit_id"   character varying NOT NULL,
                               CONSTRAINT "PK_ec06248d5da67aae936519914d7" PRIMARY KEY ("evaluation_type_id", "business_unit_id")
                             )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_353e0754575a2c7ac0cbf48f53" ON "evaluation_type_business_units" ("evaluation_type_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bdd7492ddb895ef140a14954e" ON "evaluation_type_business_units" ("business_unit_id") `,
    );
    await queryRunner.query(`CREATE TABLE "subject_teachers"
                             (
                               "subject_id" character varying NOT NULL,
                               "teacher_id" uuid              NOT NULL,
                               CONSTRAINT "PK_f8ea3eb21fd9e034007032baf93" PRIMARY KEY ("subject_id", "teacher_id")
                             )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_eb3a86e223ac7c3b5d4eddbfaf" ON "subject_teachers" ("subject_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce08d4a32bcbc1dc0e24907b5a" ON "subject_teachers" ("teacher_id") `,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."examination_calls_timezone_enum" RENAME TO "examination_calls_timezone_enum_old"`,
    );
    await queryRunner.query(`ALTER TABLE "evaluation_types"
      ADD CONSTRAINT "FK_90b560e807fb051e2069bd90f20" FOREIGN KEY ("created_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "evaluation_types"
      ADD CONSTRAINT "FK_c0532020d0015e3e477b38c1851" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "subjects"
      ADD CONSTRAINT "FK_85559b09f6515db5a67609f1e01" FOREIGN KEY ("created_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "subjects"
      ADD CONSTRAINT "FK_318996ce5920bda252b84a86ca5" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "subjects"
      ADD CONSTRAINT "FK_75376ebc031ba5d4f3369cca73f" FOREIGN KEY ("evaluation_type_id") REFERENCES "evaluation_types" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "subjects"
      ADD CONSTRAINT "FK_c9400d426b4eba38c028a3cea12" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "evaluation_type_business_units"
      ADD CONSTRAINT "FK_353e0754575a2c7ac0cbf48f533" FOREIGN KEY ("evaluation_type_id") REFERENCES "evaluation_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "evaluation_type_business_units"
      ADD CONSTRAINT "FK_9bdd7492ddb895ef140a14954e7" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "subject_teachers"
      ADD CONSTRAINT "FK_eb3a86e223ac7c3b5d4eddbfaf9" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "subject_teachers"
      ADD CONSTRAINT "FK_ce08d4a32bcbc1dc0e24907b5a8" FOREIGN KEY ("teacher_id") REFERENCES "edae_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subject_teachers"
      DROP CONSTRAINT "FK_ce08d4a32bcbc1dc0e24907b5a8"`);
    await queryRunner.query(`ALTER TABLE "subject_teachers"
      DROP CONSTRAINT "FK_eb3a86e223ac7c3b5d4eddbfaf9"`);
    await queryRunner.query(`ALTER TABLE "evaluation_type_business_units"
      DROP CONSTRAINT "FK_9bdd7492ddb895ef140a14954e7"`);
    await queryRunner.query(`ALTER TABLE "evaluation_type_business_units"
      DROP CONSTRAINT "FK_353e0754575a2c7ac0cbf48f533"`);
    await queryRunner.query(`ALTER TABLE "subjects"
      DROP CONSTRAINT "FK_c9400d426b4eba38c028a3cea12"`);
    await queryRunner.query(`ALTER TABLE "subjects"
      DROP CONSTRAINT "FK_75376ebc031ba5d4f3369cca73f"`);
    await queryRunner.query(`ALTER TABLE "subjects"
      DROP CONSTRAINT "FK_318996ce5920bda252b84a86ca5"`);
    await queryRunner.query(`ALTER TABLE "subjects"
      DROP CONSTRAINT "FK_85559b09f6515db5a67609f1e01"`);
    await queryRunner.query(`ALTER TABLE "evaluation_types"
      DROP CONSTRAINT "FK_c0532020d0015e3e477b38c1851"`);
    await queryRunner.query(`ALTER TABLE "evaluation_types"
      DROP CONSTRAINT "FK_90b560e807fb051e2069bd90f20"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ce08d4a32bcbc1dc0e24907b5a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eb3a86e223ac7c3b5d4eddbfaf"`,
    );
    await queryRunner.query(`DROP TABLE "subject_teachers"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bdd7492ddb895ef140a14954e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_353e0754575a2c7ac0cbf48f53"`,
    );
    await queryRunner.query(`DROP TABLE "evaluation_type_business_units"`);
    await queryRunner.query(`DROP TABLE "subjects"`);
    await queryRunner.query(`DROP TYPE "public"."subjects_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."subjects_modality_enum"`);
    await queryRunner.query(`DROP TABLE "evaluation_types"`);
  }
}
