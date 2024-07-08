import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixInternalGroup1720449180121 implements MigrationInterface {
  name = 'FixInternalGroup1720449180121';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "internal_groups_students"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "internal_groups_students" ("student_id" character varying NOT NULL, "internal_group_id" character varying NOT NULL, CONSTRAINT "PK_e88edd65ee45f3a153abcc1229f" PRIMARY KEY ("student_id", "internal_group_id"))`,
    );
  }
}
