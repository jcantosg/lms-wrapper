import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCommunicationSubjectFieldNullable1723459627705
  implements MigrationInterface
{
  name = 'ChangeCommunicationSubjectFieldNullable1723459627705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "communications"
      ALTER COLUMN "subject" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "communications"
      ALTER COLUMN "subject" SET NOT NULL`);
  }
}
