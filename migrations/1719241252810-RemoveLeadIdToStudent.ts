import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveLeadIdToStudent1719241252810 implements MigrationInterface {
  name = 'RemoveLeadIdToStudent1719241252810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "lead_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" ADD "lead_id" character varying`,
    );
  }
}
