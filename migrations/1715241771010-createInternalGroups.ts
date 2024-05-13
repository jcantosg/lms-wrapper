import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInternalGroups1715241771010 implements MigrationInterface {
  name = 'CreateInternalGroups1715241771010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "internal_groups" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "isDefault" boolean NOT NULL DEFAULT true, "created_by_id" character varying, "updated_by_id" character varying, "subject_id" character varying, "business_unit_id" character varying, "period_block_id" character varying, "academic_period_id" character varying, "academic_program_id" character varying, CONSTRAINT "PK_c3dfd2fc074a5b21000387c8cf7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "internal_groups_students" ("student_id" character varying NOT NULL, "internal_group_id" character varying NOT NULL, CONSTRAINT "PK_e88edd65ee45f3a153abcc1229f" PRIMARY KEY ("student_id", "internal_group_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bb9edb0c3e4a9581ee02961b07" ON "internal_groups_students" ("student_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4cc9dc59bd3a15fb359c6911ea" ON "internal_groups_students" ("internal_group_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "internal_groups_edae_users" ("edae_user_id" character varying NOT NULL, "internal_group_id" uuid NOT NULL, CONSTRAINT "PK_4f186155f5897e2f655970005a6" PRIMARY KEY ("edae_user_id", "internal_group_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87ccfbbc79f02ed1e9abfd569e" ON "internal_groups_edae_users" ("edae_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f8a38491eaf3d051d8f9ffb324" ON "internal_groups_edae_users" ("internal_group_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" ADD CONSTRAINT "FK_6b98ece20eff04dc5fd3ebb3d7a" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" ADD CONSTRAINT "FK_ee793394957ce44a35ff56a2975" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" ADD CONSTRAINT "FK_30c028add43fe8d8b5feaca54c3" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" ADD CONSTRAINT "FK_f9f7fe1b5b2054025b5345b7a46" FOREIGN KEY ("business_unit_id") REFERENCES "business_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" ADD CONSTRAINT "FK_979376960264e8c9ba5a0387d75" FOREIGN KEY ("period_block_id") REFERENCES "period_blocks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" ADD CONSTRAINT "FK_4645b63a0ca3168404bf81ebc70" FOREIGN KEY ("academic_period_id") REFERENCES "academic_periods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" ADD CONSTRAINT "FK_e1275adf28fd2359d57f9eac541" FOREIGN KEY ("academic_program_id") REFERENCES "academic_programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_students" ADD CONSTRAINT "FK_bb9edb0c3e4a9581ee02961b077" FOREIGN KEY ("student_id") REFERENCES "internal_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_students" ADD CONSTRAINT "FK_4cc9dc59bd3a15fb359c6911ea0" FOREIGN KEY ("internal_group_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "FK_87ccfbbc79f02ed1e9abfd569e5" FOREIGN KEY ("edae_user_id") REFERENCES "internal_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "FK_f8a38491eaf3d051d8f9ffb3248" FOREIGN KEY ("internal_group_id") REFERENCES "edae_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "FK_f8a38491eaf3d051d8f9ffb3248"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "FK_87ccfbbc79f02ed1e9abfd569e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_students" DROP CONSTRAINT "FK_4cc9dc59bd3a15fb359c6911ea0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_students" DROP CONSTRAINT "FK_bb9edb0c3e4a9581ee02961b077"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" DROP CONSTRAINT "FK_e1275adf28fd2359d57f9eac541"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" DROP CONSTRAINT "FK_4645b63a0ca3168404bf81ebc70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" DROP CONSTRAINT "FK_979376960264e8c9ba5a0387d75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" DROP CONSTRAINT "FK_f9f7fe1b5b2054025b5345b7a46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" DROP CONSTRAINT "FK_30c028add43fe8d8b5feaca54c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" DROP CONSTRAINT "FK_ee793394957ce44a35ff56a2975"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" DROP CONSTRAINT "FK_6b98ece20eff04dc5fd3ebb3d7a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f8a38491eaf3d051d8f9ffb324"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_87ccfbbc79f02ed1e9abfd569e"`,
    );
    await queryRunner.query(`DROP TABLE "internal_groups_edae_users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4cc9dc59bd3a15fb359c6911ea"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bb9edb0c3e4a9581ee02961b07"`,
    );
    await queryRunner.query(`DROP TABLE "internal_groups_students"`);
    await queryRunner.query(`DROP TABLE "internal_groups"`);
  }
}
