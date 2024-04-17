import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRecoveryPasswordToken1713252594671
  implements MigrationInterface
{
  name = 'CreateRecoveryPasswordToken1713252594671';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "recovery_password_tokens" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" TIMESTAMP NOT NULL, "token" character varying NOT NULL, "user_id" character varying, CONSTRAINT "PK_7085fe132dc6a1a708d613c1283" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "recovery_password_tokens" ADD CONSTRAINT "FK_51a80002387a1a4b41f75baf575" FOREIGN KEY ("user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recovery_password_tokens" DROP CONSTRAINT "FK_51a80002387a1a4b41f75baf575"`,
    );
    await queryRunner.query(`DROP TABLE "recovery_password_tokens"`);
  }
}
