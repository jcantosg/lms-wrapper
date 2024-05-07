import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProgramBlocksNumberField1715075413843
  implements MigrationInterface
{
  name = 'AddProgramBlocksNumberField1715075413843';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "academic_programs"
      ADD "program_blocks_number" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "academic_programs"
      DROP COLUMN "program_blocks_number"`);
  }
}
