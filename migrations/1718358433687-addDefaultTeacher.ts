import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultTeacher1718358433687 implements MigrationInterface {
  name = 'AddDefaultTeacher1718358433687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "internal_groups" ADD "default_teacher_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" ADD CONSTRAINT "FK_f62ed40b2f1d202f447d9c4b0f5" FOREIGN KEY ("default_teacher_id") REFERENCES "edae_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "internal_groups" DROP CONSTRAINT "FK_f62ed40b2f1d202f447d9c4b0f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "internal_groups" DROP COLUMN "default_teacher_id"`,
    );
  }
}
