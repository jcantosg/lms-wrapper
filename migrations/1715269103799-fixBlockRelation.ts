import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixBlockRelation1715269103799 implements MigrationInterface {
  name = 'FixBlockRelation1715269103799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "block_relations" DROP CONSTRAINT "FK_4319935e93c2e8638b28f565b79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" DROP CONSTRAINT "FK_5954ffd51167b2cc8cf15e22054"`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" DROP CONSTRAINT "REL_4319935e93c2e8638b28f565b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" DROP CONSTRAINT "REL_5954ffd51167b2cc8cf15e2205"`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" ADD CONSTRAINT "FK_4319935e93c2e8638b28f565b79" FOREIGN KEY ("period_block") REFERENCES "period_blocks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" ADD CONSTRAINT "FK_5954ffd51167b2cc8cf15e22054" FOREIGN KEY ("program_block") REFERENCES "program_blocks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "block_relations" DROP CONSTRAINT "FK_5954ffd51167b2cc8cf15e22054"`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" DROP CONSTRAINT "FK_4319935e93c2e8638b28f565b79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" ADD CONSTRAINT "REL_5954ffd51167b2cc8cf15e2205" UNIQUE ("program_block")`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" ADD CONSTRAINT "REL_4319935e93c2e8638b28f565b7" UNIQUE ("period_block")`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" ADD CONSTRAINT "FK_5954ffd51167b2cc8cf15e22054" FOREIGN KEY ("program_block") REFERENCES "program_blocks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "block_relations" ADD CONSTRAINT "FK_4319935e93c2e8638b28f565b79" FOREIGN KEY ("period_block") REFERENCES "period_blocks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
