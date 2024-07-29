import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsDefenseToStudent1721319549713 implements MigrationInterface {
  name = 'AddIsDefenseToStudent1721319549713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" ADD "isDefense" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "isDefense"`);
  }
}
