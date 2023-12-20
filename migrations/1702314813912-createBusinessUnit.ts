import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBusinessUnit1702314813912 implements MigrationInterface {
  name = 'CreateBusinessUnit1702314813912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "business_units" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdById" character varying, "updatedById" character varying, "countryId" character varying, CONSTRAINT "UQ_63cab0bc334669b585debb709f7" UNIQUE ("name"), CONSTRAINT "UQ_875d522984844abe7b6f2d9c976" UNIQUE ("code"), CONSTRAINT "PK_685f717d6fba03f34e19aa51b9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD CONSTRAINT "FK_9e2563f474664177ccfe8537334" FOREIGN KEY ("createdById") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD CONSTRAINT "FK_21caf0eca978efafdc96c51a4b7" FOREIGN KEY ("updatedById") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" ADD CONSTRAINT "FK_1423c7b106fab853caeb21fc802" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP CONSTRAINT "FK_1423c7b106fab853caeb21fc802"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP CONSTRAINT "FK_21caf0eca978efafdc96c51a4b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_units" DROP CONSTRAINT "FK_9e2563f474664177ccfe8537334"`,
    );
    await queryRunner.query(`DROP TABLE "business_units"`);
  }
}
