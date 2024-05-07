import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveExaminationCalls1713952910282 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "examination_calls"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."examination_calls_timezone_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."examination_calls_timezone_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."examination_calls_timezone_enum" AS ENUM('GMT-12: Línea de cambio de fecha', 'GMT-11: Samoa, Niue', 'GMT-10: Hawái, Islas Cook', 'GMT-9: Alaska', 'GMT-8: Tiempo del Pacífico, Baja California', 'GMT-7: Tiempo de la Montaña (EE. UU.)', 'GMT-6: Tiempo Central (EE. UU.), Ciudad de México', 'GMT-5: Tiempo del Este (EE. UU.), Bogotá, Lima', 'GMT-4: Tiempo del Atlántico (EE. UU.), Caracas', 'GMT-3: Buenos Aires, Santiago, Brasilia', 'GMT-2: Islas Georgias del Sur', 'GMT-1: Azores, Cabo Verde', 'GMT: Tiempo Medio de Greenwich (Londres, Lisboa)', 'GMT+1: Europa Central (París, Berlín), Madrid', 'GMT+2: Atenas, Helsinki, Beirut', 'GMT+3: Moscú, Estambul, Riad', 'GMT+4: Dubai, Bakú, Mauricio', 'GMT+5: Islamabad, Yekaterinburg', 'GMT+6: Almaty, Astaná', 'GMT+7: Bangkok, Jakarta, Ho Chi Minh', 'GMT+8: Pekín, Singapur, Manila', 'GMT+9: Tokio, Seúl', 'GMT+10: Sídney, Guam', 'GMT+11: Islas Salomón, Nueva Caledonia', 'GMT+12: Fiyi, Tuvalu')`,
    );
    await queryRunner.query(`CREATE TABLE "examination_calls"
                               (
                                 "id"                 character varying                          NOT NULL,
                                 "created_at"         TIMESTAMP                                  NOT NULL DEFAULT now(),
                                 "updated_at"         TIMESTAMP                                  NOT NULL DEFAULT now(),
                                 "name"               character varying                          NOT NULL,
                                 "start_date"         TIMESTAMP                                  NOT NULL,
                                 "end_date"           TIMESTAMP                                  NOT NULL,
                                 "timezone"           "public"."examination_calls_timezone_enum" NOT NULL,
                                 "academic_period_id" character varying,
                                 CONSTRAINT "PK_7fa8646c644eec3ac7a6bb9312f" PRIMARY KEY ("id")
                               )`);
  }
}
