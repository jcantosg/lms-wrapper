import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSnakeCase1702470126454 implements MigrationInterface {
  name = 'FixSnakeCase1702470126454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP CONSTRAINT "FK_9e2563f474664177ccfe8537334"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP CONSTRAINT "FK_21caf0eca978efafdc96c51a4b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP CONSTRAINT "FK_1423c7b106fab853caeb21fc802"`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_campus" DROP CONSTRAINT "FK_38c24cc22d078c9452d876bec1a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_campus" DROP CONSTRAINT "FK_26e1f1731e4fce9cd9261791b63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_campus" DROP CONSTRAINT "FK_39ad2dd1952c6b0172407c9b989"`,
    );
    await queryRunner.query(
      `ALTER TABLE "countries" RENAME COLUMN "phoneCode" TO "phone_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "isRevoked"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "expiresAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP COLUMN "createdById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP COLUMN "updatedById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP COLUMN "countryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "is_revoked" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "expires_at" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "user_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD "created_by_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD "updated_by_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD "country_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD CONSTRAINT "FK_687fc29cadc7af2a3d38765fea5" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD CONSTRAINT "FK_2e4bf2866e9750ecf45d22d3984" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD CONSTRAINT "FK_48491d469d3935d2dfb526e6ed2" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_campus" ADD CONSTRAINT "FK_7680fd07ad40797e5727ae3dc74" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_campus" ADD CONSTRAINT "FK_5b296c0442c4c8210c45a230f27" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_campus" ADD CONSTRAINT "FK_3ccbeb0379316fe7025e2c74d00" FOREIGN KEY ("business_unit_id") REFERENCES "business_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "virtual_campus" DROP CONSTRAINT "FK_3ccbeb0379316fe7025e2c74d00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_campus" DROP CONSTRAINT "FK_5b296c0442c4c8210c45a230f27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_campus" DROP CONSTRAINT "FK_7680fd07ad40797e5727ae3dc74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP CONSTRAINT "FK_48491d469d3935d2dfb526e6ed2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP CONSTRAINT "FK_2e4bf2866e9750ecf45d22d3984"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP CONSTRAINT "FK_687fc29cadc7af2a3d38765fea5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP COLUMN "country_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP COLUMN "updated_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP COLUMN "created_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "expires_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "is_revoked"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD "countryId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD "updatedById" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD "createdById" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "userId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "expiresAt" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "isRevoked" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "countries" RENAME COLUMN "phone_code" TO "phoneCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_campus" ADD CONSTRAINT "FK_39ad2dd1952c6b0172407c9b989" FOREIGN KEY ("business_unit_id") REFERENCES "business_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_campus" ADD CONSTRAINT "FK_26e1f1731e4fce9cd9261791b63" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_campus" ADD CONSTRAINT "FK_38c24cc22d078c9452d876bec1a" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD CONSTRAINT "FK_1423c7b106fab853caeb21fc802" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD CONSTRAINT "FK_21caf0eca978efafdc96c51a4b7" FOREIGN KEY ("updatedById") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD CONSTRAINT "FK_9e2563f474664177ccfe8537334" FOREIGN KEY ("createdById") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
