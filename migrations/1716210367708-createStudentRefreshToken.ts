import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudentRefreshToken1716210367708
  implements MigrationInterface
{
  name = 'CreateStudentRefreshToken1716210367708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "student_refresh_tokens"
                             (
                               "id"         character varying NOT NULL,
                               "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at" TIMESTAMP         NOT NULL DEFAULT now(),
                               "is_revoked" boolean           NOT NULL,
                               "expires_at" TIMESTAMP         NOT NULL,
                               "user_id"    character varying,
                               CONSTRAINT "PK_a843e5a0095a7b614f042fc5530" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "student_refresh_tokens"
      ADD CONSTRAINT "FK_92131d6af5ff002037e036a9f2c" FOREIGN KEY ("user_id") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "student_refresh_tokens"
      DROP CONSTRAINT "FK_92131d6af5ff002037e036a9f2c"`);
    await queryRunner.query(`DROP TABLE "student_refresh_tokens"`);
  }
}
