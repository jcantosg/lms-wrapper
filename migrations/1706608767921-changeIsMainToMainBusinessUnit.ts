import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeIsMainToMainBusinessUnit1706608767921
  implements MigrationInterface
{
  name = 'ChangeIsMainToMainBusinessUnit1706608767921';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "examination_centers"
      RENAME COLUMN "is_main" TO "main_business_unit_id"`);
    await queryRunner.query(`ALTER TABLE "examination_centers"
      DROP COLUMN "main_business_unit_id"`);
    await queryRunner.query(`ALTER TABLE "examination_centers"
      ADD "main_business_unit_id" character varying`);
    await queryRunner.query(`ALTER TABLE "examination_centers"
      ADD CONSTRAINT "UQ_4ad91eae76de645d9e1a81d5873" UNIQUE ("main_business_unit_id")`);
    await queryRunner.query(`ALTER TABLE "examination_centers"
      ADD CONSTRAINT "FK_4ad91eae76de645d9e1a81d5873" FOREIGN KEY ("main_business_unit_id") REFERENCES "business_units" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "examination_centers"
      DROP CONSTRAINT "FK_4ad91eae76de645d9e1a81d5873"`);
    await queryRunner.query(`ALTER TABLE "examination_centers"
      DROP CONSTRAINT "UQ_4ad91eae76de645d9e1a81d5873"`);
    await queryRunner.query(`ALTER TABLE "examination_centers"
      DROP COLUMN "main_business_unit_id"`);
    await queryRunner.query(`ALTER TABLE "examination_centers"
      ADD "main_business_unit_id" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "examination_centers"
      RENAME COLUMN "main_business_unit_id" TO "is_main"`);
  }
}
