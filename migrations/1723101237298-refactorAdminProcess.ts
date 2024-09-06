import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorAdminProcess1723101237298 implements MigrationInterface {
  name = 'RefactorAdminProcess1723101237298';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."administrative_processes_type_enum" AS ENUM('Nuevo expediente', 'Foto', 'Documento de indentidad', 'Documento de acceso')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."administrative_processes_status_enum" AS ENUM('Validado', 'Documentos pendientes', 'Rechazado', 'Documento Validado', 'Pendiente de validación')`,
    );
    await queryRunner.query(
      `CREATE TABLE "administrative_processes" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."administrative_processes_type_enum" NOT NULL, "status" "public"."administrative_processes_status_enum" NOT NULL, "files" text, "student_id" character varying, "academic_record_id" character varying, CONSTRAINT "PK_55973a4022900d070d7d2828c3c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ADD "business_unit_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ADD CONSTRAINT "FK_68f0a242bd31f4aeaeec87fddb6" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ADD CONSTRAINT "FK_24971072e7fb98b84a54faaa10f" FOREIGN KEY ("academic_record_id") REFERENCES "academic_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ADD CONSTRAINT "FK_3567b115d19e60fd2f26fa72494" FOREIGN KEY ("business_unit_id") REFERENCES "business_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" DROP CONSTRAINT "FK_3567b115d19e60fd2f26fa72494"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" DROP CONSTRAINT "FK_24971072e7fb98b84a54faaa10f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" DROP CONSTRAINT "FK_68f0a242bd31f4aeaeec87fddb6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" DROP COLUMN "business_unit_id"`,
    );
    await queryRunner.query(`DROP TABLE "administrative_processes"`);
    await queryRunner.query(
      `DROP TYPE "public"."administrative_processes_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."administrative_processes_type_enum"`,
    );
  }
}
