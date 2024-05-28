import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudentRecoveryPasswordToken1716285592630
  implements MigrationInterface
{
  name = 'CreateStudentRecoveryPasswordToken1716285592630';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "student_recovery_password_token"
                             (
                               "id"            character varying NOT NULL,
                               "created_at"    TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"    TIMESTAMP         NOT NULL DEFAULT now(),
                               "expires_at"    TIMESTAMP         NOT NULL,
                               "token"         character varying NOT NULL,
                               "isRedeemed"    boolean           NOT NULL DEFAULT false,
                               "created_by_id" character varying,
                               "updated_by_id" character varying,
                               "student_id"    character varying,
                               CONSTRAINT "PK_9490b0c0117cd1253a2255a2f49" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "student_recovery_password_token"
      ADD CONSTRAINT "FK_7b9b189374c37ba475cf9b1ed61" FOREIGN KEY ("created_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "student_recovery_password_token"
      ADD CONSTRAINT "FK_e682bb3344be14d888b08e9d747" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "student_recovery_password_token"
      ADD CONSTRAINT "FK_f7c528a308383dd20bd49af3f32" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "student_recovery_password_token"
      DROP CONSTRAINT "FK_f7c528a308383dd20bd49af3f32"`);
    await queryRunner.query(`ALTER TABLE "student_recovery_password_token"
      DROP CONSTRAINT "FK_e682bb3344be14d888b08e9d747"`);
    await queryRunner.query(`ALTER TABLE "student_recovery_password_token"
      DROP CONSTRAINT "FK_7b9b189374c37ba475cf9b1ed61"`);
    await queryRunner.query(`DROP TABLE "student_recovery_password_token"`);
  }
}
