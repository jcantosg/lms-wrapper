import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoles1702385792663 implements MigrationInterface {
  name = 'AddRoles1702385792663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_users" ADD "roles" character varying array NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin_users" DROP COLUMN "roles"`);
  }
}
