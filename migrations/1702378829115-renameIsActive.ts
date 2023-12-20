import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameIsActive1702378829115 implements MigrationInterface {
  name = 'RenameIsActive1702378829115';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_units" RENAME COLUMN "active" TO "is_active"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_units" RENAME COLUMN "is_active" TO "active"`,
    );
  }
}
