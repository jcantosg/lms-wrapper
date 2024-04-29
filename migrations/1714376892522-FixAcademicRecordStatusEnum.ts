import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixAcademicRecordStatusEnum1714376892522
  implements MigrationInterface
{
  name = 'FixAcademicRecordStatusEnum1714376892522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "academic_records" DROP CONSTRAINT "FK_45096f2e4250fad08075b7cfe1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" DROP COLUMN "student_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD "student_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."academic_records_status_enum" RENAME TO "academic_records_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."academic_records_status_enum" AS ENUM('En Vigor', 'Cancelado', 'Finalizado')`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ALTER COLUMN "status" TYPE "public"."academic_records_status_enum" USING "status"::"text"::"public"."academic_records_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."academic_records_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD CONSTRAINT "FK_45096f2e4250fad08075b7cfe1b" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "academic_records" DROP CONSTRAINT "FK_45096f2e4250fad08075b7cfe1b"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."academic_records_status_enum_old" AS ENUM('En Vigor', 'Canelado', 'Finalizado')`,
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
      `ALTER TABLE "academic_records" DROP COLUMN "student_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD "student_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD CONSTRAINT "FK_45096f2e4250fad08075b7cfe1b" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
