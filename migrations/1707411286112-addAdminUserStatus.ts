import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminUserStatus1707411286112 implements MigrationInterface {
  name = 'AddAdminUserStatus1707411286112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin_users"
      ADD "status" character varying NOT NULL DEFAULT 'active'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin_users"
      DROP COLUMN "status"`);
  }
}
