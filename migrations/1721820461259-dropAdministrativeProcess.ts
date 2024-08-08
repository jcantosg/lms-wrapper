import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropAdministrativeProcess1721820461259
  implements MigrationInterface
{
  name = 'DropAdministrativeProcess1721820461259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" DROP CONSTRAINT "FK_33920bd55d1bf18b7998ad750b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" DROP CONSTRAINT "FK_6c7cc06913b888929920d6759fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" DROP CONSTRAINT "FK_e0579272827cc433b170f1c81fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" DROP CONSTRAINT "FK_24971072e7fb98b84a54faaa10f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" DROP CONSTRAINT "FK_df373a2da6f8881ca7c4406727d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" DROP CONSTRAINT "FK_2db78e20d0c408d7ff2cbbd19b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_process_documents" DROP CONSTRAINT "FK_45d571d034f6911e3a149fd24e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_process_documents" DROP CONSTRAINT "FK_bfda6602be5fcb033c7ca1a96db"`,
    );
    await queryRunner.query(`DROP TABLE "administrative_processes"`);
    await queryRunner.query(
      `DROP TYPE "public"."administrative_processes_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."administrative_processes_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "administrative_process_documents"`);
    await queryRunner.query(
      `DROP TYPE "public"."administrative_process_documents_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."administrative_process_documents_type_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."administrative_process_documents_type_enum" AS ENUM('Nuevo expediente', 'Foto', 'Documento de indentidad', 'Documento de acceso')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."administrative_process_documents_status_enum" AS ENUM('Rechazado', 'Validado', 'Pendiente de validación')`,
    );
    await queryRunner.query(
      `CREATE TABLE "administrative_process_documents" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."administrative_process_documents_type_enum" NOT NULL, "status" "public"."administrative_process_documents_status_enum" NOT NULL, "files" text, "student_id" character varying, "academic_record_id" character varying, CONSTRAINT "PK_a621eb8b29ca796ed9a7d483dd0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."administrative_processes_type_enum" AS ENUM('Nuevo expediente', 'Foto', 'Documento de indentidad', 'Documento de acceso')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."administrative_processes_status_enum" AS ENUM('Validado', 'Documentos pendientes')`,
    );
    await queryRunner.query(
      `CREATE TABLE "administrative_processes" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."administrative_processes_type_enum" NOT NULL, "status" "public"."administrative_processes_status_enum" NOT NULL, "created_by_id" character varying, "updated_by_id" character varying, "academic_record_id" character varying, "photo_id" character varying, "identity_documents_id" character varying, "access_documents_id" character varying, CONSTRAINT "REL_24971072e7fb98b84a54faaa10" UNIQUE ("academic_record_id"), CONSTRAINT "REL_e0579272827cc433b170f1c81f" UNIQUE ("photo_id"), CONSTRAINT "REL_6c7cc06913b888929920d6759f" UNIQUE ("identity_documents_id"), CONSTRAINT "REL_33920bd55d1bf18b7998ad750b" UNIQUE ("access_documents_id"), CONSTRAINT "PK_55973a4022900d070d7d2828c3c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_process_documents" ADD CONSTRAINT "FK_bfda6602be5fcb033c7ca1a96db" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_process_documents" ADD CONSTRAINT "FK_45d571d034f6911e3a149fd24e8" FOREIGN KEY ("academic_record_id") REFERENCES "academic_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ADD CONSTRAINT "FK_2db78e20d0c408d7ff2cbbd19b6" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ADD CONSTRAINT "FK_df373a2da6f8881ca7c4406727d" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ADD CONSTRAINT "FK_24971072e7fb98b84a54faaa10f" FOREIGN KEY ("academic_record_id") REFERENCES "academic_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ADD CONSTRAINT "FK_e0579272827cc433b170f1c81fd" FOREIGN KEY ("photo_id") REFERENCES "administrative_process_documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ADD CONSTRAINT "FK_6c7cc06913b888929920d6759fb" FOREIGN KEY ("identity_documents_id") REFERENCES "administrative_process_documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ADD CONSTRAINT "FK_33920bd55d1bf18b7998ad750b9" FOREIGN KEY ("access_documents_id") REFERENCES "administrative_process_documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
