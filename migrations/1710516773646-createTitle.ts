import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTitle1710516773646 implements MigrationInterface {
  name = 'CreateTitle1710516773646';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "titles" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "official_code" character varying NOT NULL, "official_title" character varying NOT NULL, "official_program" character varying NOT NULL, "created_by_id" character varying, "updated_by_id" character varying, "business_unit_id" character varying, CONSTRAINT "PK_7c5aeca381c331c3aaf9d50931c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "titles" ADD CONSTRAINT "FK_9fe207f3fd662ce97ad2f82d43c" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "titles" ADD CONSTRAINT "FK_9ec07e064bf4fd82e042337f415" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "titles" ADD CONSTRAINT "FK_4fde7484cfc42044e79a962d555" FOREIGN KEY ("business_unit_id") REFERENCES "business_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "titles" DROP CONSTRAINT "FK_4fde7484cfc42044e79a962d555"`,
    );
    await queryRunner.query(
      `ALTER TABLE "titles" DROP CONSTRAINT "FK_9ec07e064bf4fd82e042337f415"`,
    );
    await queryRunner.query(
      `ALTER TABLE "titles" DROP CONSTRAINT "FK_9fe207f3fd662ce97ad2f82d43c"`,
    );
    await queryRunner.query(`DROP TABLE "titles"`);
  }
}
