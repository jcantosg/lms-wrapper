import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommunicationSubjectField1723022260483
  implements MigrationInterface
{
  name = 'AddCommunicationSubjectField1723022260483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "communications"
      ADD "subject" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "communications"
      DROP COLUMN "subject"`);
  }
}
