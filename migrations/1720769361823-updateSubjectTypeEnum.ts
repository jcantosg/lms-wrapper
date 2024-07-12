import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSubjectTypeEnum1720769361823 implements MigrationInterface {
  name = 'UpdateSubjectTypeEnum1720769361823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."subjects_type_enum" RENAME TO "subjects_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subjects_type_enum" AS ENUM('Asignatura', 'Trabajo Fin de Grado/Máster', 'Practica', 'Especialidad', 'Optativa')`,
    );
    await queryRunner.query(
      `ALTER TABLE "subjects" ALTER COLUMN "type" TYPE "public"."subjects_type_enum" USING "type"::"text"::"public"."subjects_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."subjects_type_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "chatrooms" ADD CONSTRAINT "FK_6294a2b7132d4f1cf97c7b7e267" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatrooms" ADD CONSTRAINT "FK_ef7ca2cd832d1c312ae6ee790a6" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatrooms" ADD CONSTRAINT "FK_686e6a7ca9ef0451a33e990c41c" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatrooms" ADD CONSTRAINT "FK_d2dc9bef9ef69dc309f5e8e618b" FOREIGN KEY ("teacher_id") REFERENCES "edae_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatrooms" ADD CONSTRAINT "FK_fb585f0fd1281e2b67ab175e242" FOREIGN KEY ("internal_group_id") REFERENCES "internal_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chatrooms" DROP CONSTRAINT "FK_fb585f0fd1281e2b67ab175e242"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatrooms" DROP CONSTRAINT "FK_d2dc9bef9ef69dc309f5e8e618b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatrooms" DROP CONSTRAINT "FK_686e6a7ca9ef0451a33e990c41c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatrooms" DROP CONSTRAINT "FK_ef7ca2cd832d1c312ae6ee790a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chatrooms" DROP CONSTRAINT "FK_6294a2b7132d4f1cf97c7b7e267"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subjects_type_enum_old" AS ENUM('Asignatura', 'Trabajo Fin de Grado/Máster', 'Practica')`,
    );
    await queryRunner.query(
      `ALTER TABLE "subjects" ALTER COLUMN "type" TYPE "public"."subjects_type_enum_old" USING "type"::"text"::"public"."subjects_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."subjects_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."subjects_type_enum_old" RENAME TO "subjects_type_enum"`,
    );
  }
}
