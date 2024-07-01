import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

export abstract class EdaeUserPasswordChecker {
  abstract checkPassword(
    plainTextPassword: string,
    user: EdaeUser,
  ): Promise<boolean>;
}
