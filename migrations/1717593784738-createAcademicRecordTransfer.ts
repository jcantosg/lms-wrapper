import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAcademicRecordTransfer1717593784738
  implements MigrationInterface
{
  name = 'CreateAcademicRecordTransfer1717593784738';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "academic_record_transfers" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "comments" character varying, "files" character varying array NOT NULL, "created_by_id" character varying, "updated_by_id" character varying, "old_academic_record_id" character varying, "new_academic_record_id" character varying, CONSTRAINT "PK_2bc89e519ae1bdfb58a305210db" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_record_transfers" ADD CONSTRAINT "FK_5e2264e0ab340916d801afc4c29" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_record_transfers" ADD CONSTRAINT "FK_72d2563180961dc20ba4fd7db18" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_record_transfers" ADD CONSTRAINT "FK_bf5db12ef8cbcf2cf44fdef012c" FOREIGN KEY ("old_academic_record_id") REFERENCES "academic_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_record_transfers" ADD CONSTRAINT "FK_510e5a7bd5f2365b3f06083ca3b" FOREIGN KEY ("new_academic_record_id") REFERENCES "academic_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "academic_record_transfers" DROP CONSTRAINT "FK_510e5a7bd5f2365b3f06083ca3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_record_transfers" DROP CONSTRAINT "FK_bf5db12ef8cbcf2cf44fdef012c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_record_transfers" DROP CONSTRAINT "FK_72d2563180961dc20ba4fd7db18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_record_transfers" DROP CONSTRAINT "FK_5e2264e0ab340916d801afc4c29"`,
    );
    await queryRunner.query(`DROP TABLE "academic_record_transfers"`);
  }
}
