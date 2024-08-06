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
      this.logger.error(error);

      return false;
    }
  }
}
