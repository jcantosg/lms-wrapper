import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatRepository } from '#shared/domain/repository/chat-repository';
import { app } from 'firebase-admin';

@Injectable()
export class ChatFirebaseRepository implements ChatRepository {
  private readonly logger: Logger;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.logger = new Logger(ChatFirebaseRepository.name);
  }

  async createUser(
    id: string,
    email: string,
    password: string,
    displayName: string,
  ): Promise<void> {
    await this.firebaseApp.auth().createUser({
      uid: id,
      email,
      emailVerified: true,
      password,
      displayName,
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.firebaseApp.auth().deleteUser(id);
  }

  async existUserByEmail(email: string): Promise<boolean> {
    try {
      const userRecord = await this.firebaseApp.auth().getUserByEmail(email);

      return !!userRecord;
    } catch (error) {
      this.logger.error(`Error user: ${email} doest not exists ${error}`);

      return false;
    }
  }

  async createToken(email: string, userId: string): Promise<string | null> {
    try {
      if (await this.existUserByEmail(email)) {
        return await this.firebaseApp.auth().createCustomToken(userId);
      }

      return null;
    } catch (error) {
      this.logger.error(`Error getToken fb with user ${email}:  ${error}`);

      return null;
    }
  }
}
