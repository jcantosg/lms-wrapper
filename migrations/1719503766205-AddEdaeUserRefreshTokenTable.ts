import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEdaeUserRefreshTokenTable1719503766205
  implements MigrationInterface
{
  name = 'AddEdaeUserRefreshTokenTable1719503766205';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "edae_user_refresh_tokens" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_revoked" boolean NOT NULL, "expires_at" TIMESTAMP NOT NULL, "user_id" uuid, CONSTRAINT "PK_4081ad44978ddf3c3cf4b9c5c2e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "edae_user_refresh_tokens"`);
  }
}
