import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCountryToExaminationCenter1705052440572
  implements MigrationInterface
{
  name = 'AddCountryToExaminationCenter1705052440572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "examination_centers" ADD "country_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "examination_centers" ADD CONSTRAINT "FK_0a67ccd42643e574f8825d8c0a4" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "examination_centers" DROP CONSTRAINT "FK_0a67ccd42643e574f8825d8c0a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "examination_centers" DROP COLUMN "country_id"`,
    );
  }
}
