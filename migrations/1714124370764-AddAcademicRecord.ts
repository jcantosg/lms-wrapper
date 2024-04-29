import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAcademicRecord1714124370764 implements MigrationInterface {
  name = 'AddAcademicRecord1714124370764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."academic_records_modality_enum" AS ENUM('E-Learning', 'Mixta', 'Presencial')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."academic_records_status_enum" AS ENUM('En Vigor', 'Canelado', 'Finalizado')`,
    );
    await queryRunner.query(
      `CREATE TABLE "academic_records" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "modality" "public"."academic_records_modality_enum" NOT NULL, "isModular" boolean NOT NULL, "status" "public"."academic_records_status_enum" NOT NULL, "created_by_id" character varying, "updated_by_id" character varying, "business_unit_id" character varying, "virtual_campus_id" character varying, "academic_period_id" character varying, "academic_program_id" character varying, CONSTRAINT "PK_68c11ee3a966085c0823dd616a1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD "student_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD CONSTRAINT "FK_8ec521b83d0e19faf03305585d7" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD CONSTRAINT "FK_ca1310f166324f350f2039b9649" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD CONSTRAINT "FK_d437062453b29ccba2ffcdc70b3" FOREIGN KEY ("business_unit_id") REFERENCES "business_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD CONSTRAINT "FK_d1554023e04a7e70911df12a774" FOREIGN KEY ("virtual_campus_id") REFERENCES "virtual_campus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD CONSTRAINT "FK_c2600ef0e3c77a2981fcb6b2b7b" FOREIGN KEY ("academic_period_id") REFERENCES "academic_periods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD CONSTRAINT "FK_6a5ed7441558211de974ff2c016" FOREIGN KEY ("academic_program_id") REFERENCES "academic_programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "academic_records" DROP CONSTRAINT "FK_6a5ed7441558211de974ff2c016"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" DROP CONSTRAINT "FK_c2600ef0e3c77a2981fcb6b2b7b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" DROP CONSTRAINT "FK_d1554023e04a7e70911df12a774"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" DROP CONSTRAINT "FK_d437062453b29ccba2ffcdc70b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" DROP CONSTRAINT "FK_ca1310f166324f350f2039b9649"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" DROP CONSTRAINT "FK_8ec521b83d0e19faf03305585d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_records" DROP COLUMN "student_id"`,
    );
    await queryRunner.query(`DROP TABLE "academic_records"`);
    await queryRunner.query(
      `DROP TYPE "public"."academic_records_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."academic_records_modality_enum"`,
    );
  }
}
