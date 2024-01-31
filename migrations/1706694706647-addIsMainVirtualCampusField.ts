import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsMainVirtualCampusField1706694706647
  implements MigrationInterface
{
  name = 'AddIsMainVirtualCampusField1706694706647';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "virtual_campus"
      ADD "is_main" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "virtual_campus"
      DROP COLUMN "is_main"`);
  }
}
