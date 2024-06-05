import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCRMImport1717163675784 implements MigrationInterface {
  name = 'CreateCRMImport1717163675784';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."crm_imports_status_enum" AS ENUM('created', 'parsed', 'completed', 'import_error', 'parse_error')`,
    );
    await queryRunner.query(
      `CREATE TABLE "crm_imports" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."crm_imports_status_enum" NOT NULL DEFAULT 'created', "contactId" character varying, "leadId" character varying, "data" json, CONSTRAINT "PK_66f9cde494ba4202a4e52f38b80" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "crm_imports"`);
    await queryRunner.query(`DROP TYPE "public"."crm_imports_status_enum"`);
  }
}
