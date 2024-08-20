import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCommunications1723652097029 implements MigrationInterface {
  name = 'UpdateCommunications1723652097029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "communication_students" DROP CONSTRAINT "FK_f96af8abd764f2cf4480fbddf46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" DROP CONSTRAINT "FK_264b9480d76b41c9d4d273f019a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" DROP COLUMN "created_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" DROP COLUMN "updated_by_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "communication_students" ADD "updated_by_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" ADD "created_by_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" ADD CONSTRAINT "FK_264b9480d76b41c9d4d273f019a" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication_students" ADD CONSTRAINT "FK_f96af8abd764f2cf4480fbddf46" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
