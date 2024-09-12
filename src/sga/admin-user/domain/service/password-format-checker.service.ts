import { InvalidFormatPasswordException } from '#shared/domain/exception/admin-user/invalid-format-password.exception';

export class PasswordFormatChecker {
  check(password: string) {
    const regex = new RegExp(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!¡¿?.,()/%$€])(?!.\\s).{8,20}$/,
    );

    if (!regex.test(password)) {
      throw new InvalidFormatPasswordException();
    }
  }
}
