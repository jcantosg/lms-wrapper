import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveSubjectFromComm1723801840342 implements MigrationInterface {
  name = 'RemoveSubjectFromComm1723801840342';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "communications" DROP COLUMN "subject"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "communications" ADD "subject" character varying`,
    );
  }
}
