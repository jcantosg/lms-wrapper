import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdministrativeGroup1715118548036 implements MigrationInterface {
  name = 'AddAdministrativeGroup1715118548036';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "administrative_groups" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "created_by_id" character varying, "updated_by_id" character varying, "business_unit_id" character varying, "academic_period_id" character varying, "academic_program_id" character varying, "program_block_id" character varying, CONSTRAINT "UQ_b6871a390ed81273e2e52326187" UNIQUE ("code"), CONSTRAINT "PK_cef9279435867445cb99253fe3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "administrative_group_students" ("administrative_group_id" character varying NOT NULL, "student_id" character varying NOT NULL, CONSTRAINT "PK_ab974bf9f8d7b4a2a8d6bf8b81f" PRIMARY KEY ("administrative_group_id", "student_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2c527afce5f85ed21efc97f66e" ON "administrative_group_students" ("administrative_group_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cdaa6c391ed6eef919a98c6c51" ON "administrative_group_students" ("student_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "administrative_group_teachers" ("administrative_group_id" character varying NOT NULL, "edae_user_id" uuid NOT NULL, CONSTRAINT "PK_9f582685a60d12be5e1357369b5" PRIMARY KEY ("administrative_group_id", "edae_user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_09b1879c77a9440d88daf53b6d" ON "administrative_group_teachers" ("administrative_group_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_945228a30b3f1e73cf01543c19" ON "administrative_group_teachers" ("edae_user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" ADD CONSTRAINT "FK_9ce6dc2a916fb2b4e96d26950d5" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" ADD CONSTRAINT "FK_826d0223513734db81f47bad8a5" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" ADD CONSTRAINT "FK_08d8b09f2e0bf9b2b7c176a5c9c" FOREIGN KEY ("business_unit_id") REFERENCES "business_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" ADD CONSTRAINT "FK_daac7603401f336b5d0af5c7efe" FOREIGN KEY ("academic_period_id") REFERENCES "academic_periods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" ADD CONSTRAINT "FK_72992c7746956d1cdc55dd61a82" FOREIGN KEY ("academic_program_id") REFERENCES "academic_programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" ADD CONSTRAINT "FK_c3bdc2632fca3eb0a917057f424" FOREIGN KEY ("program_block_id") REFERENCES "program_blocks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_group_students" ADD CONSTRAINT "FK_2c527afce5f85ed21efc97f66ed" FOREIGN KEY ("administrative_group_id") REFERENCES "administrative_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_group_students" ADD CONSTRAINT "FK_cdaa6c391ed6eef919a98c6c512" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_group_teachers" ADD CONSTRAINT "FK_09b1879c77a9440d88daf53b6dd" FOREIGN KEY ("administrative_group_id") REFERENCES "administrative_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_group_teachers" ADD CONSTRAINT "FK_945228a30b3f1e73cf01543c19c" FOREIGN KEY ("edae_user_id") REFERENCES "edae_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "administrative_group_teachers" DROP CONSTRAINT "FK_945228a30b3f1e73cf01543c19c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_group_teachers" DROP CONSTRAINT "FK_09b1879c77a9440d88daf53b6dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_group_students" DROP CONSTRAINT "FK_cdaa6c391ed6eef919a98c6c512"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_group_students" DROP CONSTRAINT "FK_2c527afce5f85ed21efc97f66ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" DROP CONSTRAINT "FK_c3bdc2632fca3eb0a917057f424"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" DROP CONSTRAINT "FK_72992c7746956d1cdc55dd61a82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" DROP CONSTRAINT "FK_daac7603401f336b5d0af5c7efe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" DROP CONSTRAINT "FK_08d8b09f2e0bf9b2b7c176a5c9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" DROP CONSTRAINT "FK_826d0223513734db81f47bad8a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" DROP CONSTRAINT "FK_9ce6dc2a916fb2b4e96d26950d5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_945228a30b3f1e73cf01543c19"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_09b1879c77a9440d88daf53b6d"`,
    );
    await queryRunner.query(`DROP TABLE "administrative_group_teachers"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cdaa6c391ed6eef919a98c6c51"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2c527afce5f85ed21efc97f66e"`,
    );
    await queryRunner.query(`DROP TABLE "administrative_group_students"`);
    await queryRunner.query(`DROP TABLE "administrative_groups"`);
  }
}
