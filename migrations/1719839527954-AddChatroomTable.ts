import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChatroomTable1719839527954 implements MigrationInterface {
  name = 'AddChatroomTable1719839527954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chatrooms" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "chatroom_id" character varying, "created_by_id" character varying, "updated_by_id" character varying, "student_id" character varying, "teacher_id" uuid, "internal_group_id" character varying, CONSTRAINT "PK_d190d6f785fb99dffb138cd0443" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "chatrooms"`);
  }
}
