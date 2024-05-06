import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultTeacherToSubject1714723876328
  implements MigrationInterface
{
  name = 'AddDefaultTeacherToSubject1714723876328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subjects" ADD "default_teacher_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "subjects" ADD CONSTRAINT "FK_92c477472acd30b73e8a9fc6767" FOREIGN KEY ("default_teacher_id") REFERENCES "edae_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subjects" DROP CONSTRAINT "FK_92c477472acd30b73e8a9fc6767"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subjects" DROP COLUMN "default_teacher_id"`,
    );
  }
}
