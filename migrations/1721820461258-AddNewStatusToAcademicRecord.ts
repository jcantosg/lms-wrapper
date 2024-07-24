import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewStatusToAcademicRecord1721820461258
  implements MigrationInterface
{
  name = 'AddNewStatusToAcademicRecord1721820461258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."academic_records_status_enum" RENAME TO "academic_records_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."academic_records_status_enum" AS ENUM('En Vigor', 'Cancelado', 'Finalizado', 'Cancelado por traslado')`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ALTER COLUMN "status" TYPE "public"."academic_records_status_enum" USING "status"::"text"::"public"."academic_records_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."academic_records_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."academic_records_status_enum" RENAME TO "academic_records_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."academic_records_status_enum" AS ENUM('En Vigor', 'Cancelado', 'Finalizado', 'Cancelado por traslado')`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ALTER COLUMN "status" TYPE "public"."academic_records_status_enum" USING "status"::"text"::"public"."academic_records_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."academic_records_status_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."academic_records_status_enum_old" AS ENUM('En Vigor', 'Cancelado', 'Finalizado')`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ALTER COLUMN "status" TYPE "public"."academic_records_status_enum_old" USING "status"::"text"::"public"."academic_records_status_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."academic_records_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."academic_records_status_enum_old" RENAME TO "academic_records_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."academic_records_status_enum_old" AS ENUM('En Vigor', 'Cancelado', 'Finalizado')`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ALTER COLUMN "status" TYPE "public"."academic_records_status_enum_old" USING "status"::"text"::"public"."academic_records_status_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."academic_records_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."academic_records_status_enum_old" RENAME TO "academic_records_status_enum"`,
    );
  }
}
