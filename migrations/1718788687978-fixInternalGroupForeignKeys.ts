import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixInternalGroupForeignKeys1718788687978
  implements MigrationInterface
{
  name = 'FixInternalGroupForeignKeys1718788687978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "internal_groups_students" DROP CONSTRAINT "FK_bb9edb0c3e4a9581ee02961b077"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_students" DROP CONSTRAINT "FK_4cc9dc59bd3a15fb359c6911ea0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "FK_87ccfbbc79f02ed1e9abfd569e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "FK_f8a38491eaf3d051d8f9ffb3248"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "PK_4f186155f5897e2f655970005a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "PK_87ccfbbc79f02ed1e9abfd569e5" PRIMARY KEY ("edae_user_id")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f8a38491eaf3d051d8f9ffb324"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP COLUMN "internal_group_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD "internal_group_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "PK_87ccfbbc79f02ed1e9abfd569e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "PK_4f186155f5897e2f655970005a6" PRIMARY KEY ("edae_user_id", "internal_group_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "PK_4f186155f5897e2f655970005a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "PK_f8a38491eaf3d051d8f9ffb3248" PRIMARY KEY ("internal_group_id")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_87ccfbbc79f02ed1e9abfd569e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP COLUMN "edae_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD "edae_user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "PK_f8a38491eaf3d051d8f9ffb3248"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "PK_4f186155f5897e2f655970005a6" PRIMARY KEY ("internal_group_id", "edae_user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f8a38491eaf3d051d8f9ffb324" ON "internal_groups_edae_users" ("internal_group_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87ccfbbc79f02ed1e9abfd569e" ON "internal_groups_edae_users" ("edae_user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_students" ADD CONSTRAINT "FK_4cc9dc59bd3a15fb359c6911ea0" FOREIGN KEY ("internal_group_id") REFERENCES "internal_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_students" ADD CONSTRAINT "FK_bb9edb0c3e4a9581ee02961b077" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "FK_f8a38491eaf3d051d8f9ffb3248" FOREIGN KEY ("internal_group_id") REFERENCES "internal_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "FK_87ccfbbc79f02ed1e9abfd569e5" FOREIGN KEY ("edae_user_id") REFERENCES "edae_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "FK_87ccfbbc79f02ed1e9abfd569e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "FK_f8a38491eaf3d051d8f9ffb3248"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_students" DROP CONSTRAINT "FK_bb9edb0c3e4a9581ee02961b077"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_students" DROP CONSTRAINT "FK_4cc9dc59bd3a15fb359c6911ea0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_87ccfbbc79f02ed1e9abfd569e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f8a38491eaf3d051d8f9ffb324"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "PK_4f186155f5897e2f655970005a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "PK_f8a38491eaf3d051d8f9ffb3248" PRIMARY KEY ("internal_group_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP COLUMN "edae_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD "edae_user_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87ccfbbc79f02ed1e9abfd569e" ON "internal_groups_edae_users" ("edae_user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "PK_f8a38491eaf3d051d8f9ffb3248"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "PK_4f186155f5897e2f655970005a6" PRIMARY KEY ("edae_user_id", "internal_group_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "PK_4f186155f5897e2f655970005a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "PK_87ccfbbc79f02ed1e9abfd569e5" PRIMARY KEY ("edae_user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP COLUMN "internal_group_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD "internal_group_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f8a38491eaf3d051d8f9ffb324" ON "internal_groups_edae_users" ("internal_group_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" DROP CONSTRAINT "PK_87ccfbbc79f02ed1e9abfd569e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "PK_4f186155f5897e2f655970005a6" PRIMARY KEY ("internal_group_id", "edae_user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "FK_f8a38491eaf3d051d8f9ffb3248" FOREIGN KEY ("internal_group_id") REFERENCES "edae_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_edae_users" ADD CONSTRAINT "FK_87ccfbbc79f02ed1e9abfd569e5" FOREIGN KEY ("edae_user_id") REFERENCES "internal_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_students" ADD CONSTRAINT "FK_4cc9dc59bd3a15fb359c6911ea0" FOREIGN KEY ("internal_group_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups_students" ADD CONSTRAINT "FK_bb9edb0c3e4a9581ee02961b077" FOREIGN KEY ("student_id") REFERENCES "internal_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
