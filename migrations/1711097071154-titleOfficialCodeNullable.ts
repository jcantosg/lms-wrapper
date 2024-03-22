import { MigrationInterface, QueryRunner } from 'typeorm';

export class TitleOfficialCodeNullable1711097071154
  implements MigrationInterface
{
  name = 'TitleOfficialCodeNullable1711097071154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "titles"
      ALTER COLUMN "official_code" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "titles"
      ALTER COLUMN "official_code" SET NOT NULL`);
  }
}
