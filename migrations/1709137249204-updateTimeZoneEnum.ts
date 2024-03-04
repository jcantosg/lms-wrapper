import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTimeZoneEnum1709137249204 implements MigrationInterface {
  name = 'UpdateTimeZoneEnum1709137249204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."examination_calls_timezone_enum" RENAME TO "examination_calls_timezone_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."examination_calls_timezone_enum" AS ENUM('GMT-12: Línea de cambio de fecha', 'GMT-11: Samoa, Niue', 'GMT-10: Hawái, Islas Cook', 'GMT-9: Alaska', 'GMT-8: Tiempo del Pacífico, Baja California', 'GMT-7: Tiempo de la Montaña (EE. UU.)', 'GMT-6: Tiempo Central (EE. UU.), Ciudad de México', 'GMT-5: Tiempo del Este (EE. UU.), Bogotá, Lima', 'GMT-4: Tiempo del Atlántico (EE. UU.), Caracas', 'GMT-3: Buenos Aires, Santiago, Brasilia', 'GMT-2: Islas Georgias del Sur', 'GMT-1: Azores, Cabo Verde', 'GMT: Tiempo Medio de Greenwich (Londres, Lisboa)', 'GMT+1: Europa Central (París, Berlín), Madrid', 'GMT+2: Atenas, Helsinki, Beirut', 'GMT+3: Moscú, Estambul, Riad', 'GMT+4: Dubai, Bakú, Mauricio', 'GMT+5: Islamabad, Yekaterinburg', 'GMT+6: Almaty, Astaná', 'GMT+7: Bangkok, Jakarta, Ho Chi Minh', 'GMT+8: Pekín, Singapur, Manila', 'GMT+9: Tokio, Seúl', 'GMT+10: Sídney, Guam', 'GMT+11: Islas Salomón, Nueva Caledonia', 'GMT+12: Fiyi, Tuvalu')`,
    );
    await queryRunner.query(
      `ALTER TABLE "examination_calls" ALTER COLUMN "timezone" TYPE "public"."examination_calls_timezone_enum" USING "timezone"::"text"::"public"."examination_calls_timezone_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."examination_calls_timezone_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."edae_users_timezone_enum" RENAME TO "edae_users_timezone_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."edae_users_timezone_enum" AS ENUM('GMT-12: Línea de cambio de fecha', 'GMT-11: Samoa, Niue', 'GMT-10: Hawái, Islas Cook', 'GMT-9: Alaska', 'GMT-8: Tiempo del Pacífico, Baja California', 'GMT-7: Tiempo de la Montaña (EE. UU.)', 'GMT-6: Tiempo Central (EE. UU.), Ciudad de México', 'GMT-5: Tiempo del Este (EE. UU.), Bogotá, Lima', 'GMT-4: Tiempo del Atlántico (EE. UU.), Caracas', 'GMT-3: Buenos Aires, Santiago, Brasilia', 'GMT-2: Islas Georgias del Sur', 'GMT-1: Azores, Cabo Verde', 'GMT: Tiempo Medio de Greenwich (Londres, Lisboa)', 'GMT+1: Europa Central (París, Berlín), Madrid', 'GMT+2: Atenas, Helsinki, Beirut', 'GMT+3: Moscú, Estambul, Riad', 'GMT+4: Dubai, Bakú, Mauricio', 'GMT+5: Islamabad, Yekaterinburg', 'GMT+6: Almaty, Astaná', 'GMT+7: Bangkok, Jakarta, Ho Chi Minh', 'GMT+8: Pekín, Singapur, Manila', 'GMT+9: Tokio, Seúl', 'GMT+10: Sídney, Guam', 'GMT+11: Islas Salomón, Nueva Caledonia', 'GMT+12: Fiyi, Tuvalu')`,
    );
    await queryRunner.query(
      `ALTER TABLE "edae_users" ALTER COLUMN "timeZone" TYPE "public"."edae_users_timezone_enum" USING "timeZone"::"text"::"public"."edae_users_timezone_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."edae_users_timezone_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."edae_users_timezone_enum_old" AS ENUM('GMT', 'GMT+1', 'GMT+2', 'GMT+3', 'GMT+4', 'GMT+5', 'GMT+6', 'GMT+7', 'GMT+8', 'GMT+9', 'GMT+10', 'GMT+11', 'GMT+12')`,
    );
    await queryRunner.query(
      `ALTER TABLE "edae_users" ALTER COLUMN "timeZone" TYPE "public"."edae_users_timezone_enum_old" USING "timeZone"::"text"::"public"."edae_users_timezone_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."edae_users_timezone_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."edae_users_timezone_enum_old" RENAME TO "edae_users_timezone_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."examination_calls_timezone_enum_old" AS ENUM('GMT', 'GMT+1', 'GMT+2', 'GMT+3', 'GMT+4', 'GMT+5', 'GMT+6', 'GMT+7', 'GMT+8', 'GMT+9', 'GMT+10', 'GMT+11', 'GMT+12')`,
    );
    await queryRunner.query(
      `ALTER TABLE "examination_calls" ALTER COLUMN "timezone" TYPE "public"."examination_calls_timezone_enum_old" USING "timezone"::"text"::"public"."examination_calls_timezone_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."examination_calls_timezone_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."examination_calls_timezone_enum_old" RENAME TO "examination_calls_timezone_enum"`,
    );
  }
}
