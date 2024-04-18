import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLoginAttempts1712558836633 implements MigrationInterface {
  name = 'AddLoginAttempts1712558836633';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin_users"
      ADD "login_attempts" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin_users"
      DROP COLUMN "login_attempts"`);
  }
}
