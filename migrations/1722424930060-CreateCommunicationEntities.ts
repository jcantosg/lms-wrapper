import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommunicationEntities1722424930060
  implements MigrationInterface
{
  name = 'CreateCommunicationEntities1722424930060';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "communication_students" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_read" boolean NOT NULL DEFAULT false, "is_deleted" boolean NOT NULL DEFAULT false, "communication_id" character varying, "student_id" character varying, "created_by_id" character varying, "updated_by_id" character varying, CONSTRAINT "PK_bb03c8d688b9b5bb594eca707e0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."communications_status_enum" AS ENUM('draft', 'sent')`,
    );
    await queryRunner.query(
      `CREATE TABLE "communications" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sent_at" TIMESTAMP, "send_by_email" boolean, "publish_on_board" boolean, "status" "public"."communications_status_enum", "message" json, "created_by_id" character varying, "updated_by_id" character varying, "sent_by_id" character varying, CONSTRAINT "PK_29ec793018d5d5ca19d40149e87" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "communication_business_units" ("communication_id" character varying NOT NULL, "business_unit_id" character varying NOT NULL, CONSTRAINT "PK_87b4b4264656a72639cfb722c19" PRIMARY KEY ("communication_id", "business_unit_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_41bbf40bb8e030d7534f947075" ON "communication_business_units" ("communication_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f452ebe26decf8ae6981ff01bc" ON "communication_business_units" ("business_unit_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "communication_academic_periods" ("communication_id" character varying NOT NULL, "academic_period_id" character varying NOT NULL, CONSTRAINT "PK_a48b4ed59bb3bebea2a7fc983bc" PRIMARY KEY ("communication_id", "academic_period_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ad388dc6ca5dbac5e1b73030e8" ON "communication_academic_periods" ("communication_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_331b69e7180e697a1b305c1cc7" ON "communication_academic_periods" ("academic_period_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "communication_titles" ("communication_id" character varying NOT NULL, "title_id" character varying NOT NULL, CONSTRAINT "PK_938c15406cd8d24733fef0d9a60" PRIMARY KEY ("communication_id", "title_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4623b06fc314623d26245b319b" ON "communication_titles" ("communication_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9ac5f50f5ec00dbe2a2a4382c6" ON "communication_titles" ("title_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "communication_academic_programs" ("communication_id" character varying NOT NULL, "academic_program_id" character varying NOT NULL, CONSTRAINT "PK_b5c5bdc1aa924ef0338565410be" PRIMARY KEY ("communication_id", "academic_program_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d3346dbd87f42a3e0575846f31" ON "communication_academic_programs" ("communication_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_59980c79b0964ac61a5aaff29e" ON "communication_academic_programs" ("academic_program_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "communication_internal_groups" ("communication_id" character varying NOT NULL, "internal_group_id" character varying NOT NULL, CONSTRAINT "PK_ddb7dba26c5610feab7e9ea98de" PRIMARY KEY ("communication_id", "internal_group_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_78b4fafa6dac2c771879a1918b" ON "communication_internal_groups" ("communication_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7eabcd248885895a69e712f060" ON "communication_internal_groups" ("internal_group_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" ADD CONSTRAINT "FK_fd8ea0cab600c4393f51a40b033" FOREIGN KEY ("communication_id") REFERENCES "communications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" ADD CONSTRAINT "FK_92665208fe8c0b8bf8b5cad2b75" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" ADD CONSTRAINT "FK_f96af8abd764f2cf4480fbddf46" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" ADD CONSTRAINT "FK_264b9480d76b41c9d4d273f019a" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communications" ADD CONSTRAINT "FK_fc096f528e032786794ec49daf7" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communications" ADD CONSTRAINT "FK_0e8412929ee53236959e2db4afa" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communications" ADD CONSTRAINT "FK_3116504a5d39dc61ac5837babc4" FOREIGN KEY ("sent_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_business_units" ADD CONSTRAINT "FK_41bbf40bb8e030d7534f947075b" FOREIGN KEY ("communication_id") REFERENCES "communications"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_business_units" ADD CONSTRAINT "FK_f452ebe26decf8ae6981ff01bc3" FOREIGN KEY ("business_unit_id") REFERENCES "business_units"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_academic_periods" ADD CONSTRAINT "FK_ad388dc6ca5dbac5e1b73030e87" FOREIGN KEY ("communication_id") REFERENCES "communications"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_academic_periods" ADD CONSTRAINT "FK_331b69e7180e697a1b305c1cc7d" FOREIGN KEY ("academic_period_id") REFERENCES "academic_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_titles" ADD CONSTRAINT "FK_4623b06fc314623d26245b319b2" FOREIGN KEY ("communication_id") REFERENCES "communications"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_titles" ADD CONSTRAINT "FK_9ac5f50f5ec00dbe2a2a4382c62" FOREIGN KEY ("title_id") REFERENCES "titles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_academic_programs" ADD CONSTRAINT "FK_d3346dbd87f42a3e0575846f315" FOREIGN KEY ("communication_id") REFERENCES "communications"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_academic_programs" ADD CONSTRAINT "FK_59980c79b0964ac61a5aaff29e2" FOREIGN KEY ("academic_program_id") REFERENCES "academic_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_internal_groups" ADD CONSTRAINT "FK_78b4fafa6dac2c771879a1918b8" FOREIGN KEY ("communication_id") REFERENCES "communications"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_internal_groups" ADD CONSTRAINT "FK_7eabcd248885895a69e712f0609" FOREIGN KEY ("internal_group_id") REFERENCES "internal_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "communication_internal_groups" DROP CONSTRAINT "FK_7eabcd248885895a69e712f0609"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_internal_groups" DROP CONSTRAINT "FK_78b4fafa6dac2c771879a1918b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_academic_programs" DROP CONSTRAINT "FK_59980c79b0964ac61a5aaff29e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_academic_programs" DROP CONSTRAINT "FK_d3346dbd87f42a3e0575846f315"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_titles" DROP CONSTRAINT "FK_9ac5f50f5ec00dbe2a2a4382c62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_titles" DROP CONSTRAINT "FK_4623b06fc314623d26245b319b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_academic_periods" DROP CONSTRAINT "FK_331b69e7180e697a1b305c1cc7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_academic_periods" DROP CONSTRAINT "FK_ad388dc6ca5dbac5e1b73030e87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_business_units" DROP CONSTRAINT "FK_f452ebe26decf8ae6981ff01bc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_business_units" DROP CONSTRAINT "FK_41bbf40bb8e030d7534f947075b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communications" DROP CONSTRAINT "FK_3116504a5d39dc61ac5837babc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communications" DROP CONSTRAINT "FK_0e8412929ee53236959e2db4afa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communications" DROP CONSTRAINT "FK_fc096f528e032786794ec49daf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" DROP CONSTRAINT "FK_264b9480d76b41c9d4d273f019a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" DROP CONSTRAINT "FK_f96af8abd764f2cf4480fbddf46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" DROP CONSTRAINT "FK_92665208fe8c0b8bf8b5cad2b75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" DROP CONSTRAINT "FK_fd8ea0cab600c4393f51a40b033"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7eabcd248885895a69e712f060"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_78b4fafa6dac2c771879a1918b"`,
    );
    await queryRunner.query(`DROP TABLE "communication_internal_groups"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_59980c79b0964ac61a5aaff29e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d3346dbd87f42a3e0575846f31"`,
    );
    await queryRunner.query(`DROP TABLE "communication_academic_programs"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9ac5f50f5ec00dbe2a2a4382c6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4623b06fc314623d26245b319b"`,
    );
    await queryRunner.query(`DROP TABLE "communication_titles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_331b69e7180e697a1b305c1cc7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ad388dc6ca5dbac5e1b73030e8"`,
    );
    await queryRunner.query(`DROP TABLE "communication_academic_periods"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f452ebe26decf8ae6981ff01bc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_41bbf40bb8e030d7534f947075"`,
    );
    await queryRunner.query(`DROP TABLE "communication_business_units"`);
    await queryRunner.query(`DROP TABLE "communications"`);
    await queryRunner.query(`DROP TYPE "public"."communications_status_enum"`);
    await queryRunner.query(`DROP TABLE "communication_students"`);
  }
}
