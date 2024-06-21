import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLeadIdtoStudent1718891426384 implements MigrationInterface {
  name = 'AddLeadIdtoStudent1718891426384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" ADD "lead_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "lead_id"`);
  }
}
