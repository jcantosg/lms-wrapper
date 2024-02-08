import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdentityDocumentAndSurnamesToAdminUser1706798678149
  implements MigrationInterface
{
  name = 'AddIdentityDocumentAndSurnamesToAdminUser1706798678149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin_users"
      ADD "surname" character varying NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "admin_users"
      ADD "surname_2" character varying NULL`);
    await queryRunner.query(`ALTER TABLE "admin_users"
      ADD "identity_document" json NOT NULL DEFAULT '{}'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin_users"
      DROP COLUMN "identity_document"`);
    await queryRunner.query(`ALTER TABLE "admin_users"
      DROP COLUMN "surname_2"`);
    await queryRunner.query(`ALTER TABLE "admin_users"
      DROP COLUMN "surname"`);
  }
}
