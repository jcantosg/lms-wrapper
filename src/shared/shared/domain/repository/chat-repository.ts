export abstract class ChatRepository {
  abstract createUser(
    id: string,
    email: string,
    password: string,
    displayName: string,
  ): Promise<void>;
  abstract deleteUser(id: string): Promise<void>;
  abstract existUserByEmail(email: string): Promise<boolean>;
  abstract createToken(email: string, userId: string): Promise<string | null>;
}
