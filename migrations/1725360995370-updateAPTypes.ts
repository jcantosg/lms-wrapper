import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAPTypes1725360995370 implements MigrationInterface {
  name = 'UpdateAPTypes1725360995370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."administrative_processes_type_enum" RENAME TO "administrative_processes_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."administrative_processes_type_enum" AS ENUM('Nuevo expediente', 'Foto', 'Documento de identidad', 'Documento de acceso', 'Convalidación', 'Renuncia')`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_processes" ALTER COLUMN "type" TYPE "public"."administrative_processes_type_enum" USING "type"::"text"::"public"."administrative_processes_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."administrative_processes_type_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."administrative_processes_type_enum_old" AS ENUM('Convalidación', 'Documento de acceso', 'Documento de indentidad', 'Foto', 'Nuevo expediente', 'Renuncia')`,
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
  }
}
