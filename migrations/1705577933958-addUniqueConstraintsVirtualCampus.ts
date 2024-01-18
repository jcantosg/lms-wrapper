import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintsVirtualCampus1705577933958
  implements MigrationInterface
{
  name = 'AddUniqueConstraintsVirtualCampus1705577933958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "virtual_campus"
      ADD CONSTRAINT "UQ_748affcd3f1321a847ee8368bca" UNIQUE ("name")`);
    await queryRunner.query(`ALTER TABLE "virtual_campus"
      ADD CONSTRAINT "UQ_8b12fe08f62c4d562197fc423e7" UNIQUE ("code")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "virtual_campus"
      DROP CONSTRAINT "UQ_8b12fe08f62c4d562197fc423e7"`);
    await queryRunner.query(`ALTER TABLE "virtual_campus"
      DROP CONSTRAINT "UQ_748affcd3f1321a847ee8368bca"`);
  }
}
