import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPeriodBlockToAdministrativeGroup1715782946253
  implements MigrationInterface
{
  name = 'AddPeriodBlockToAdministrativeGroup1715782946253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" ADD "period_block_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" ADD CONSTRAINT "FK_7f690e22758e519b9df794ca9ec" FOREIGN KEY ("period_block_id") REFERENCES "period_blocks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" DROP CONSTRAINT "FK_7f690e22758e519b9df794ca9ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" DROP COLUMN "period_block_id"`,
    );
  }
}
