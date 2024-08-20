import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFilesField1724150996676 implements MigrationInterface {
  name = 'UpdateFilesField1724150996676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" DROP COLUMN "files"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ADD "files" json`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" DROP COLUMN "files"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ADD "files" text`,
    );
  }
}
