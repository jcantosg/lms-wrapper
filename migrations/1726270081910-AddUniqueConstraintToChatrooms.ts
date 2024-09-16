import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintToChatrooms1726270081910
  implements MigrationInterface
{
  name = 'AddUniqueConstraintToChatrooms1726270081910';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chatrooms" ADD CONSTRAINT "UQ_3f2d8af15f937215f9db39653b0" UNIQUE ("internal_group_id", "student_id", "teacher_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chatrooms" DROP CONSTRAINT "UQ_3f2d8af15f937215f9db39653b0"`,
    );
  }
}
