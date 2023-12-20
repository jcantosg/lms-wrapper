import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVirtualCampus1702386467957 implements MigrationInterface {
  name = 'CreateVirtualCampus1702386467957';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "virtual_campus"
                             (
                               "id"               character varying NOT NULL,
                               "created_at"       TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"       TIMESTAMP         NOT NULL DEFAULT now(),
                               "name"             character varying NOT NULL,
                               "code"             character varying NOT NULL,
                               "is_active"        boolean           NOT NULL DEFAULT true,
                               "created_by_id"    character varying,
                               "updated_by_id"    character varying,
                               "business_unit_id" character varying,
                               CONSTRAINT "PK_9b07b72955905d7acd46bf9e91a" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "virtual_campus"
      ADD CONSTRAINT "FK_38c24cc22d078c9452d876bec1a" FOREIGN KEY ("created_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "virtual_campus"
      ADD CONSTRAINT "FK_26e1f1731e4fce9cd9261791b63" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "virtual_campus"
      ADD CONSTRAINT "FK_39ad2dd1952c6b0172407c9b989" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "virtual_campus"
      DROP CONSTRAINT "FK_39ad2dd1952c6b0172407c9b989"`);
    await queryRunner.query(`ALTER TABLE "virtual_campus"
      DROP CONSTRAINT "FK_26e1f1731e4fce9cd9261791b63"`);
    await queryRunner.query(`ALTER TABLE "virtual_campus"
      DROP CONSTRAINT "FK_38c24cc22d078c9452d876bec1a"`);
    await queryRunner.query(`DROP TABLE "virtual_campus"`);
  }
}
