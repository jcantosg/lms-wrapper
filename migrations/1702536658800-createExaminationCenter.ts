import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExaminationCenter1702536658800
  implements MigrationInterface
{
  name = 'CreateExaminationCenter1702536658800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "examination_centers"
                             (
                               "id"            character varying NOT NULL,
                               "created_at"    TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"    TIMESTAMP         NOT NULL DEFAULT now(),
                               "name"          character varying NOT NULL,
                               "code"          character varying NOT NULL,
                               "is_active"     boolean           NOT NULL DEFAULT true,
                               "address"       character varying NOT NULL,
                               "created_by_id" character varying,
                               "updated_by_id" character varying,
                               CONSTRAINT "UQ_17880f25f4ffaa3e4bebde8c7db" UNIQUE ("code"),
                               CONSTRAINT "PK_f8ad37635b1292b3fccfbcb5b43" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "business_unit_examination_centers"
                             (
                               "examination_center_id" character varying NOT NULL,
                               "business_unit_id"      character varying NOT NULL,
                               CONSTRAINT "PK_d48b4d8b72cbff53fb92c8b0155" PRIMARY KEY ("examination_center_id", "business_unit_id")
                             )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_ae5a89ec9edcd6ac82b263c837" ON "business_unit_examination_centers" ("examination_center_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9576955f80e7daf4707e9dd97" ON "business_unit_examination_centers" ("business_unit_id") `,
    );
    await queryRunner.query(`ALTER TABLE "examination_centers"
      ADD CONSTRAINT "FK_2b6776f53a4308aa664b80cfe6c" FOREIGN KEY ("created_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "examination_centers"
      ADD CONSTRAINT "FK_d01b69ee116331ddd46ec9a0276" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "business_unit_examination_centers"
      ADD CONSTRAINT "FK_ae5a89ec9edcd6ac82b263c8373" FOREIGN KEY ("examination_center_id") REFERENCES "examination_centers" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "business_unit_examination_centers"
      ADD CONSTRAINT "FK_c9576955f80e7daf4707e9dd97c" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "business_unit_examination_centers"
      DROP CONSTRAINT "FK_c9576955f80e7daf4707e9dd97c"`);
    await queryRunner.query(`ALTER TABLE "business_unit_examination_centers"
      DROP CONSTRAINT "FK_ae5a89ec9edcd6ac82b263c8373"`);
    await queryRunner.query(`ALTER TABLE "examination_centers"
      DROP CONSTRAINT "FK_d01b69ee116331ddd46ec9a0276"`);
    await queryRunner.query(`ALTER TABLE "examination_centers"
      DROP CONSTRAINT "FK_2b6776f53a4308aa664b80cfe6c"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c9576955f80e7daf4707e9dd97"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ae5a89ec9edcd6ac82b263c837"`,
    );
    await queryRunner.query(`DROP TABLE "business_unit_examination_centers"`);
    await queryRunner.query(`DROP TABLE "examination_centers"`);
  }
}
