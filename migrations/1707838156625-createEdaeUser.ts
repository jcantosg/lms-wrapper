import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEdaeUser1707838156625 implements MigrationInterface {
  name = 'CreateEdaeUser1707838156625';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."edae_users_roles_enum" AS ENUM('Docente', 'Tutor', 'Responsable tutor', 'Coordinador FCT', 'Responsable FCT', 'Gestor FCT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."edae_users_timezone_enum" AS ENUM('GMT', 'GMT+1', 'GMT+2', 'GMT+3', 'GMT+4', 'GMT+5', 'GMT+6', 'GMT+7', 'GMT+8', 'GMT+9', 'GMT+10', 'GMT+11', 'GMT+12')`,
    );
    await queryRunner.query(`CREATE TABLE "edae_users"
                             (
                               "id"                uuid                                   NOT NULL DEFAULT uuid_generate_v4(),
                               "created_at"        TIMESTAMP                              NOT NULL DEFAULT now(),
                               "updated_at"        TIMESTAMP                              NOT NULL DEFAULT now(),
                               "name"              character varying                      NOT NULL,
                               "surname1"          character varying                      NOT NULL,
                               "surname2"          character varying,
                               "email"             character varying                      NOT NULL,
                               "identity_document" json                                   NOT NULL,
                               "roles"             "public"."edae_users_roles_enum" array NOT NULL,
                               "timeZone"          "public"."edae_users_timezone_enum"    NOT NULL,
                               "isRemote"          boolean                                NOT NULL,
                               "avatar"            character varying,
                               "location_id"       character varying,
                               CONSTRAINT "UQ_5a4ac1e7c39bee2d38abba554ff" UNIQUE ("email"),
                               CONSTRAINT "PK_78438c0578ab5b360e19e5d51de" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "edae_user_business_units"
                             (
                               "edae_user_id"     uuid              NOT NULL,
                               "business_unit_id" character varying NOT NULL,
                               CONSTRAINT "PK_757f7bd3e9367ca01be411f49b9" PRIMARY KEY ("edae_user_id", "business_unit_id")
                             )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_2ab8dae1fdc7d9df7eaaab111f" ON "edae_user_business_units" ("edae_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e305d005a17d52b585a068ba5d" ON "edae_user_business_units" ("business_unit_id") `,
    );
    await queryRunner.query(`ALTER TABLE "edae_users"
      ADD CONSTRAINT "FK_172a9ba591fcc27650f5d8bf7f2" FOREIGN KEY ("location_id") REFERENCES "countries" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "edae_user_business_units"
      ADD CONSTRAINT "FK_2ab8dae1fdc7d9df7eaaab111f3" FOREIGN KEY ("edae_user_id") REFERENCES "edae_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "edae_user_business_units"
      ADD CONSTRAINT "FK_e305d005a17d52b585a068ba5dd" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "edae_user_business_units"
      DROP CONSTRAINT "FK_e305d005a17d52b585a068ba5dd"`);
    await queryRunner.query(`ALTER TABLE "edae_user_business_units"
      DROP CONSTRAINT "FK_2ab8dae1fdc7d9df7eaaab111f3"`);
    await queryRunner.query(`ALTER TABLE "edae_users"
      DROP CONSTRAINT "FK_172a9ba591fcc27650f5d8bf7f2"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e305d005a17d52b585a068ba5d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2ab8dae1fdc7d9df7eaaab111f"`,
    );
    await queryRunner.query(`DROP TABLE "edae_user_business_units"`);
    await queryRunner.query(`DROP TABLE "edae_users"`);
    await queryRunner.query(`DROP TYPE "public"."edae_users_timezone_enum"`);
    await queryRunner.query(`DROP TYPE "public"."edae_users_roles_enum"`);
  }
}
