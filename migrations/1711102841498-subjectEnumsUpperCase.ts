import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubjectEnumsUpperCase1711102841498 implements MigrationInterface {
  name = 'SubjectEnumsUpperCase1711102841498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."subjects_modality_enum" RENAME TO "subjects_modality_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subjects_modality_enum" AS ENUM('E-Learning', 'Mixta', 'Presencial')`,
    );
    await queryRunner.query(`ALTER TABLE "subjects"
      ALTER COLUMN "modality" TYPE "public"."subjects_modality_enum" USING "modality"::"text"::"public"."subjects_modality_enum"`);
    await queryRunner.query(`DROP TYPE "public"."subjects_modality_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."subjects_type_enum" RENAME TO "subjects_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subjects_type_enum" AS ENUM('Asignatura', 'Trabajo Fin de Grado/Máster', 'Practica')`,
    );
    await queryRunner.query(`ALTER TABLE "subjects"
      ALTER COLUMN "type" TYPE "public"."subjects_type_enum" USING "type"::"text"::"public"."subjects_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."subjects_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."subjects_type_enum_old" AS ENUM('asignatura', 'Trabajo Fin de Grado/Máster', 'practica')`,
    );
    await queryRunner.query(`ALTER TABLE "subjects"
      ALTER COLUMN "type" TYPE "public"."subjects_type_enum_old" USING "type"::"text"::"public"."subjects_type_enum_old"`);
    await queryRunner.query(`DROP TYPE "public"."subjects_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."subjects_type_enum_old" RENAME TO "subjects_type_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subjects_modality_enum_old" AS ENUM('e-learning', 'mixta', 'presencial')`,
    );
    await queryRunner.query(`ALTER TABLE "subjects"
      ALTER COLUMN "modality" TYPE "public"."subjects_modality_enum_old" USING "modality"::"text"::"public"."subjects_modality_enum_old"`);
    await queryRunner.query(`DROP TYPE "public"."subjects_modality_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."subjects_modality_enum_old" RENAME TO "subjects_modality_enum"`,
    );
  }
}
