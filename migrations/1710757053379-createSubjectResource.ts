import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubjectResource1710757053379 implements MigrationInterface {
  name = 'CreateSubjectResource1710757053379';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "subject_resources"
                             (
                               "id"         character varying NOT NULL,
                               "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at" TIMESTAMP         NOT NULL DEFAULT now(),
                               "name"       character varying NOT NULL,
                               "url"        character varying NOT NULL,
                               "size"       integer           NOT NULL,
                               "subject_id" character varying,
                               CONSTRAINT "PK_9c7c2b3b2c93370da4233eac25e" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "subject_resources"
      ADD "created_by_id" character varying`);
    await queryRunner.query(`ALTER TABLE "subject_resources"
      ADD "updated_by_id" character varying`);
    await queryRunner.query(`ALTER TABLE "subject_resources"
      ADD CONSTRAINT "FK_2e9b1f6abf398458fb9126bbbe8" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "subject_resources"
      ADD CONSTRAINT "FK_c31653cd1d006d62648443929d7" FOREIGN KEY ("created_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "subject_resources"
      ADD CONSTRAINT "FK_ccde768306d8842c19dd6b25813" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subject_resources"
      DROP CONSTRAINT "FK_ccde768306d8842c19dd6b25813"`);
    await queryRunner.query(`ALTER TABLE "subject_resources"
      DROP CONSTRAINT "FK_c31653cd1d006d62648443929d7"`);
    await queryRunner.query(`ALTER TABLE "subject_resources"
      DROP CONSTRAINT "FK_2e9b1f6abf398458fb9126bbbe8"`);
    await queryRunner.query(`ALTER TABLE "subject_resources"
      DROP COLUMN "updated_by_id"`);
    await queryRunner.query(`ALTER TABLE "subject_resources"
      DROP COLUMN "created_by_id"`);
    await queryRunner.query(`DROP TABLE "subject_resources"`);
  }
}
