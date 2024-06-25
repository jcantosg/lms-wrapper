import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLeadIdToAcademicRecord1719242641638
  implements MigrationInterface
{
  name = 'AddLeadIdToAcademicRecord1719242641638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "academic_records" ADD "lead_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "academic_records" DROP COLUMN "lead_id"`,
    );
  }
}
