import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStudentAddInternalGroups1720086400538
  implements MigrationInterface
{
  name = 'UpdateStudentAddInternalGroups1720086400538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "internal_group_students" ("student_id" character varying NOT NULL, "internal_group_id" character varying NOT NULL, CONSTRAINT "PK_f50453a97d561bf7b56a11eeabb" PRIMARY KEY ("student_id", "internal_group_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_93bf5278d74896a07b2d95cd63" ON "internal_group_students" ("student_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5393b7857a5b1c9e025338c7b7" ON "internal_group_students" ("internal_group_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "edae_user_refresh_tokens" ADD CONSTRAINT "FK_57b6d8eb15ce00cdde0ff2f3bbf" FOREIGN KEY ("user_id") REFERENCES "edae_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_group_students" ADD CONSTRAINT "FK_93bf5278d74896a07b2d95cd633" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_group_students" ADD CONSTRAINT "FK_5393b7857a5b1c9e025338c7b71" FOREIGN KEY ("internal_group_id") REFERENCES "internal_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "internal_group_students" DROP CONSTRAINT "FK_5393b7857a5b1c9e025338c7b71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_group_students" DROP CONSTRAINT "FK_93bf5278d74896a07b2d95cd633"`,
    );
    await queryRunner.query(
      `ALTER TABLE "edae_user_refresh_tokens" DROP CONSTRAINT "FK_57b6d8eb15ce00cdde0ff2f3bbf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5393b7857a5b1c9e025338c7b7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_93bf5278d74896a07b2d95cd63"`,
    );
    await queryRunner.query(`DROP TABLE "internal_group_students"`);
  }
}
