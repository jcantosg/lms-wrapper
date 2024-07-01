import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordToEdaeUser1719219189401 implements MigrationInterface {
  name = 'AddPasswordToEdaeUser1719219189401';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "edae_users" ADD "password" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "edae_users" DROP COLUMN "password"`);
  }
}
