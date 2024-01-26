import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBusinessUnitsToAdminUser1705924900345
  implements MigrationInterface
{
  name = 'AddBusinessUnitsToAdminUser1705924900345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "business_unit_admin_user" ("admin_user_id" character varying NOT NULL, "business_unit_id" character varying NOT NULL, CONSTRAINT "PK_a181445c70a6170a68064a7e1c4" PRIMARY KEY ("admin_user_id", "business_unit_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6016aad79f13952a750066b976" ON "business_unit_admin_user" ("admin_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8a3806b94aabdda1426408ddeb" ON "business_unit_admin_user" ("business_unit_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "business_unit_admin_user" ADD CONSTRAINT "FK_6016aad79f13952a750066b976d" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_unit_admin_user" ADD CONSTRAINT "FK_8a3806b94aabdda1426408ddeb5" FOREIGN KEY ("business_unit_id") REFERENCES "business_units"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_unit_admin_user" DROP CONSTRAINT "FK_8a3806b94aabdda1426408ddeb5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_unit_admin_user" DROP CONSTRAINT "FK_6016aad79f13952a750066b976d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8a3806b94aabdda1426408ddeb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6016aad79f13952a750066b976"`,
    );
    await queryRunner.query(`DROP TABLE "business_unit_admin_user"`);
  }
}
