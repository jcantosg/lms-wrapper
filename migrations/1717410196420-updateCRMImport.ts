import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCRMImport1717410196420 implements MigrationInterface {
  name = 'UpdateCRMImport1717410196420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "crm_imports" ADD "file_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_imports" ADD CONSTRAINT "UQ_e8b3b7647e357c6c37fa8032930" UNIQUE ("file_name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_imports" ADD "error_message" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "crm_imports" DROP COLUMN "error_message"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_imports" DROP CONSTRAINT "UQ_e8b3b7647e357c6c37fa8032930"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_imports" DROP COLUMN "file_name"`,
    );
  }
}
