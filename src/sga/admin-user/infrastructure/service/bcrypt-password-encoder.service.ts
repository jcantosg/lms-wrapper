import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';
import { hash } from 'bcrypt';

const HASH_SALT = 10;

export class BCryptPasswordEncoder implements PasswordEncoder {
  async encodePassword(plainTextPassword: string): Promise<string> {
    return await hash(plainTextPassword, HASH_SALT);
  }
}
