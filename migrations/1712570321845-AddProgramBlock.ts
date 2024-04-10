import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProgramBlock1712570321845 implements MigrationInterface {
  name = 'AddProgramBlock1712570321845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "program_blocks" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "created_by_id" character varying, "updated_by_id" character varying, "academic_program_id" character varying, CONSTRAINT "PK_18a953e058ee72fbb4fd3124064" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "program_block_subjects" ("program_block_id" character varying NOT NULL, "subject_id" character varying NOT NULL, CONSTRAINT "PK_f691ad1ff1b3d810d378627127d" PRIMARY KEY ("program_block_id", "subject_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4780d244252b57ff444b9eb403" ON "program_block_subjects" ("program_block_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f2f322757cf519c60b4ed56f27" ON "program_block_subjects" ("subject_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."academic_programs_structuretype_enum" AS ENUM('Cuatrimestre', 'Semestre', 'Anual', 'Personalizado')`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_programs" ADD "structureType" "public"."academic_programs_structuretype_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_blocks" ADD CONSTRAINT "FK_744bd6ef4422026625136985c5c" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_blocks" ADD CONSTRAINT "FK_3ef64066cb08e0d5557a95423e3" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_blocks" ADD CONSTRAINT "FK_ae965e77f5f94162b40a7fc4e05" FOREIGN KEY ("academic_program_id") REFERENCES "academic_programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_block_subjects" ADD CONSTRAINT "FK_4780d244252b57ff444b9eb403c" FOREIGN KEY ("program_block_id") REFERENCES "program_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_block_subjects" ADD CONSTRAINT "FK_f2f322757cf519c60b4ed56f276" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "program_block_subjects" DROP CONSTRAINT "FK_f2f322757cf519c60b4ed56f276"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_block_subjects" DROP CONSTRAINT "FK_4780d244252b57ff444b9eb403c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_blocks" DROP CONSTRAINT "FK_ae965e77f5f94162b40a7fc4e05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_blocks" DROP CONSTRAINT "FK_3ef64066cb08e0d5557a95423e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_blocks" DROP CONSTRAINT "FK_744bd6ef4422026625136985c5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_programs" DROP COLUMN "structureType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."academic_programs_structuretype_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f2f322757cf519c60b4ed56f27"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4780d244252b57ff444b9eb403"`,
    );
    await queryRunner.query(`DROP TABLE "program_block_subjects"`);
    await queryRunner.query(`DROP TABLE "program_blocks"`);
  }
}
