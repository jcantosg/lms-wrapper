import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCommunication1724774228181 implements MigrationInterface {
  name = 'UpdateCommunication1724774228181';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "communication_recipients" ("communication_id" character varying NOT NULL, "student_id" character varying NOT NULL, CONSTRAINT "PK_07834eaed4e9dedd9216bb8affe" PRIMARY KEY ("communication_id", "student_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cd2551332d057b830882caf0d7" ON "communication_recipients" ("communication_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0fcc22164e65bec8ea0eac9200" ON "communication_recipients" ("student_id") `,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."administrative_processes_type_enum" RENAME TO "administrative_processes_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."administrative_processes_type_enum" AS ENUM('Nuevo expediente', 'Foto', 'Documento de indentidad', 'Documento de acceso', 'Convalidación', 'Renuncia')`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ALTER COLUMN "type" TYPE "public"."administrative_processes_type_enum" USING "type"::"text"::"public"."administrative_processes_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."administrative_processes_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_recipients" ADD CONSTRAINT "FK_cd2551332d057b830882caf0d76" FOREIGN KEY ("communication_id") REFERENCES "communications"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_recipients" ADD CONSTRAINT "FK_0fcc22164e65bec8ea0eac92002" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "communication_recipients" DROP CONSTRAINT "FK_0fcc22164e65bec8ea0eac92002"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_recipients" DROP CONSTRAINT "FK_cd2551332d057b830882caf0d76"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."administrative_processes_type_enum_old" AS ENUM('Nuevo expediente', 'Foto', 'Documento de indentidad', 'Documento de acceso')`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ALTER COLUMN "type" TYPE "public"."administrative_processes_type_enum_old" USING "type"::"text"::"public"."administrative_processes_type_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."administrative_processes_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."administrative_processes_type_enum_old" RENAME TO "administrative_processes_type_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."administrative_processes_type_enum_old" AS ENUM('Nuevo expediente', 'Foto', 'Documento de indentidad', 'Documento de acceso')`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ALTER COLUMN "type" TYPE "public"."administrative_processes_type_enum_old" USING "type"::"text"::"public"."administrative_processes_type_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."administrative_processes_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."administrative_processes_type_enum_old" RENAME TO "administrative_processes_type_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0fcc22164e65bec8ea0eac9200"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cd2551332d057b830882caf0d7"`,
    );
    await queryRunner.query(`DROP TABLE "communication_recipients"`);
  }
}
