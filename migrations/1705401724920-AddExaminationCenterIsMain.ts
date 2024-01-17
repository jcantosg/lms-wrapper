import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExaminationCenterIsMain1705401724920
  implements MigrationInterface
{
  name = 'AddExaminationCenterIsMain1705401724920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "examination_centers"
      ADD "is_main" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "examination_centers"
      DROP COLUMN "is_main"`);
  }
}
