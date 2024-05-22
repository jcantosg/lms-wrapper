export abstract class PasswordEncoder {
  abstract encodePassword(plainTextPassword: string): Promise<string>;
}
