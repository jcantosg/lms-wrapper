import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableSubjectOfficialCode1709825781427
  implements MigrationInterface
{
  name = 'NullableSubjectOfficialCode1709825781427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subjects"
      ALTER COLUMN "official_code" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subjects"
      ALTER COLUMN "official_code" SET NOT NULL`);
  }
}
