import { MigrationInterface, QueryRunner } from 'typeorm';

export class BlockRelation1714984409031 implements MigrationInterface {
  name = 'BlockRelation1714984409031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "block_relations" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "period_block" character varying, "program_block" character varying, "created_by_id" character varying, "updated_by_id" character varying, CONSTRAINT "REL_4319935e93c2e8638b28f565b7" UNIQUE ("period_block"), CONSTRAINT "REL_5954ffd51167b2cc8cf15e2205" UNIQUE ("program_block"), CONSTRAINT "PK_1212f15963a22af95033bd460cf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "period_blocks" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "academic_period_id" character varying, "created_by_id" character varying, "updated_by_id" character varying, CONSTRAINT "PK_112e6fe20a6128c47b7b4e02ac1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" ADD CONSTRAINT "FK_4319935e93c2e8638b28f565b79" FOREIGN KEY ("period_block") REFERENCES "period_blocks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" ADD CONSTRAINT "FK_5954ffd51167b2cc8cf15e22054" FOREIGN KEY ("program_block") REFERENCES "program_blocks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" ADD CONSTRAINT "FK_f6fe9ea229308409e26cf30aef8" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" ADD CONSTRAINT "FK_7cf1e4467851f7c16be57d098ef" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "period_blocks" ADD CONSTRAINT "FK_12608427bd0a2bb011f3d36ab75" FOREIGN KEY ("academic_period_id") REFERENCES "academic_periods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "period_blocks" ADD CONSTRAINT "FK_45e5978d269ccb3e9b8e4d49f61" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "period_blocks" ADD CONSTRAINT "FK_2b0379e7c9239b89cc42ff838d6" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "period_blocks" DROP CONSTRAINT "FK_2b0379e7c9239b89cc42ff838d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "period_blocks" DROP CONSTRAINT "FK_45e5978d269ccb3e9b8e4d49f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "period_blocks" DROP CONSTRAINT "FK_12608427bd0a2bb011f3d36ab75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" DROP CONSTRAINT "FK_7cf1e4467851f7c16be57d098ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" DROP CONSTRAINT "FK_f6fe9ea229308409e26cf30aef8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" DROP CONSTRAINT "FK_5954ffd51167b2cc8cf15e22054"`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" DROP CONSTRAINT "FK_4319935e93c2e8638b28f565b79"`,
    );
    await queryRunner.query(`DROP TABLE "period_blocks"`);
    await queryRunner.query(`DROP TABLE "block_relations"`);
  }
}
