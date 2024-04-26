import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStudent1713793741660 implements MigrationInterface {
  name = 'AddStudent1713793741660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "students"
                             (
                               "id"                     character varying NOT NULL,
                               "created_at"             TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"             TIMESTAMP         NOT NULL DEFAULT now(),
                               "name"                   character varying NOT NULL,
                               "surname"                character varying NOT NULL,
                               "surname2"               character varying NOT NULL,
                               "email"                  character varying NOT NULL,
                               "universaeEmail"         character varying NOT NULL,
                               "avatar"                 character varying,
                               "birthDate"              TIMESTAMP,
                               "gender"                 character varying,
                               "identity_document"      json                       DEFAULT '{}',
                               "social_security_number" character varying,
                               "status"                 character varying NOT NULL,
                               "isActive"               boolean           NOT NULL DEFAULT true,
                               "origin"                 character varying NOT NULL DEFAULT 'sga',
                               "crm_id"                 character varying,
                               "access_qualification"   character varying,
                               "nia_idalu"              character varying,
                               "phone"                  character varying,
                               "state"                  character varying,
                               "city"                   character varying,
                               "address"                character varying,
                               "guardianName"           character varying,
                               "guardianSurname"        character varying,
                               "guardianEmail"          character varying,
                               "guardianPhone"          character varying,
                               "created_by_id"          character varying,
                               "updated_by_id"          character varying,
                               "country_id"             character varying,
                               "citizenship_id"         character varying,
                               "contact_country_id"     character varying,
                               CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id")
                             )`);

    await queryRunner.query(`ALTER TABLE "students"
      ADD CONSTRAINT "FK_24f98e457b1379cbca9d52c9260" FOREIGN KEY ("created_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "students"
      ADD CONSTRAINT "FK_820ef09f63e994942694ee2d793" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "students"
      ADD CONSTRAINT "FK_519ef86eb77efdff5a1144d3237" FOREIGN KEY ("country_id") REFERENCES "countries" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "students"
      ADD CONSTRAINT "FK_438031a129e9e652e8d1b66ffb8" FOREIGN KEY ("citizenship_id") REFERENCES "countries" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "students"
      ADD CONSTRAINT "FK_40dc070963ce10f6c0ee6c9eedd" FOREIGN KEY ("contact_country_id") REFERENCES "countries" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students"
      DROP CONSTRAINT "FK_40dc070963ce10f6c0ee6c9eedd"`);
    await queryRunner.query(`ALTER TABLE "students"
      DROP CONSTRAINT "FK_438031a129e9e652e8d1b66ffb8"`);
    await queryRunner.query(`ALTER TABLE "students"
      DROP CONSTRAINT "FK_519ef86eb77efdff5a1144d3237"`);
    await queryRunner.query(`ALTER TABLE "students"
      DROP CONSTRAINT "FK_820ef09f63e994942694ee2d793"`);
    await queryRunner.query(`ALTER TABLE "students"
      DROP CONSTRAINT "FK_24f98e457b1379cbca9d52c9260"`);
    await queryRunner.query(`DROP TABLE "students"`);
  }
}
