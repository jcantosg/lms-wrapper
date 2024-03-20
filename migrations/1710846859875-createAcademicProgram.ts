import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAcademicProgram1710846859875 implements MigrationInterface {
  name = 'CreateAcademicProgram1710846859875';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "academic_programs" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "created_by_id" character varying, "updated_by_id" character varying, "business_unit_id" character varying, "title_id" character varying, CONSTRAINT "UQ_58b2947ae0bcccee61b20b31b0d" UNIQUE ("code"), CONSTRAINT "PK_27e387feaac71037c08230a06bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_programs" ADD CONSTRAINT "FK_984898dfe1727229db47cdb5964" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_programs" ADD CONSTRAINT "FK_d626aa7e972e66cb7db324a23f5" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_programs" ADD CONSTRAINT "FK_280a13624964e6fb8dfa425890f" FOREIGN KEY ("business_unit_id") REFERENCES "business_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_programs" ADD CONSTRAINT "FK_70a626f090e8bc3c325270e925c" FOREIGN KEY ("title_id") REFERENCES "titles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "academic_programs" DROP CONSTRAINT "FK_70a626f090e8bc3c325270e925c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_programs" DROP CONSTRAINT "FK_280a13624964e6fb8dfa425890f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_programs" DROP CONSTRAINT "FK_d626aa7e972e66cb7db324a23f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_programs" DROP CONSTRAINT "FK_984898dfe1727229db47cdb5964"`,
    );
    await queryRunner.query(`DROP TABLE "academic_programs"`);
  }
}
