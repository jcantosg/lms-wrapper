import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameAdminUser1704886669750 implements MigrationInterface {
  name = 'AddNameAdminUser1704886669750';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_users" ADD "name" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_users" ADD "avatar" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin_users" DROP COLUMN "avatar"`);
    await queryRunner.query(`ALTER TABLE "admin_users" DROP COLUMN "name"`);
  }
}
