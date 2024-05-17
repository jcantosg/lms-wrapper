import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStudentsNumberToAdministrativeGroup1715756869424
  implements MigrationInterface
{
  name = 'AddStudentsNumberToAdministrativeGroup1715756869424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" ADD "students_number" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "administrative_groups" DROP COLUMN "students_number"`,
    );
  }
}
