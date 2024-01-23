import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClassroom1705922153817 implements MigrationInterface {
  name = 'CreateClassroom1705922153817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "classrooms"
                             (
                               "id"                    character varying NOT NULL,
                               "created_at"            TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"            TIMESTAMP         NOT NULL DEFAULT now(),
                               "name"                  character varying NOT NULL,
                               "code"                  character varying NOT NULL,
                               "capacity"              integer           NOT NULL,
                               "is_active"             boolean           NOT NULL DEFAULT true,
                               "created_by_id"         character varying,
                               "updated_by_id"         character varying,
                               "examination_center_id" character varying,
                               CONSTRAINT "UQ_7970c5df0018bd7bc59491a3db9" UNIQUE ("code"),
                               CONSTRAINT "PK_20b7b82896c06eda27548bd0c24" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "classrooms"
      ADD CONSTRAINT "FK_f00d2e7ddd4ac299c6f3fab8c85" FOREIGN KEY ("created_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "classrooms"
      ADD CONSTRAINT "FK_d26cf675d4a69bbfde307cb935b" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "classrooms"
      ADD CONSTRAINT "FK_62e58de7cdf353b6678e73e44d4" FOREIGN KEY ("examination_center_id") REFERENCES "examination_centers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "classrooms"
      DROP CONSTRAINT "FK_62e58de7cdf353b6678e73e44d4"`);
    await queryRunner.query(`ALTER TABLE "classrooms"
      DROP CONSTRAINT "FK_d26cf675d4a69bbfde307cb935b"`);
    await queryRunner.query(`ALTER TABLE "classrooms"
      DROP CONSTRAINT "FK_f00d2e7ddd4ac299c6f3fab8c85"`);
    await queryRunner.query(`DROP TABLE "classrooms"`);
  }
}
