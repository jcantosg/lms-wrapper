import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOfficialRegionalCode1710944831977
  implements MigrationInterface
{
  name = 'AddOfficialRegionalCode1710944831977';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subjects"
      ADD "official_regional_code" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subjects"
      DROP COLUMN "official_regional_code"`);
  }
}
