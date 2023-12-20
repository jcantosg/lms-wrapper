import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminUserAndCountry1702294992460 implements MigrationInterface {
  name = 'AdminUserAndCountry1702294992460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin_users" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_dcd0c8a4b10af9c986e510b9ecc" UNIQUE ("email"), CONSTRAINT "PK_06744d221bb6145dc61e5dc441d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "countries" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "iso" character varying NOT NULL, "iso3" character varying NOT NULL, "name" character varying NOT NULL, "phoneCode" character varying NOT NULL, "emoji" character varying NOT NULL, CONSTRAINT "UQ_a1c0d005a87cc318b4ddda4d925" UNIQUE ("iso"), CONSTRAINT "UQ_b29f9172f8b660e7834000c4246" UNIQUE ("iso3"), CONSTRAINT "UQ_fa1376321185575cf2226b1491d" UNIQUE ("name"), CONSTRAINT "UQ_f34cf01de8dee223e0da6cf250d" UNIQUE ("emoji"), CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "countries"`);
    await queryRunner.query(`DROP TABLE "admin_users"`);
  }
}
