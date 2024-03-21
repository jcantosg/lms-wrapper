import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubjectHoursNullable1710946311426 implements MigrationInterface {
  name = 'SubjectHoursNullable1710946311426';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subjects"
      ALTER COLUMN "hours" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subjects"
      ALTER COLUMN "hours" SET NOT NULL`);
  }
}
