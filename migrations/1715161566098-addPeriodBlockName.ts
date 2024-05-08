import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPeriodBlockName1715161566098 implements MigrationInterface {
  name = 'AddPeriodBlockName1715161566098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "period_blocks" ADD "name" character varying NOT NULL DEFAULT 'Block'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "period_blocks" DROP COLUMN "name"`);
  }
}
