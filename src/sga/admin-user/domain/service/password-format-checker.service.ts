import { InvalidFormatPasswordException } from '#shared/domain/exception/admin-user/invalid-format-password.exception';

export class PasswordFormatChecker {
  check(password: string) {
    const regex = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#&()?[{}])([A-Za-z\d$@$!%*?&]|[^ ]){8,20}$/,
    );

    if (!regex.test(password)) {
      throw new InvalidFormatPasswordException();
    }
  }
}
