import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatRepository } from '#shared/domain/repository/chat-repository';
import { app, auth } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import UserRecord = auth.UserRecord;

@Injectable()
export class ChatFirebaseRepository implements ChatRepository {
  private readonly logger: Logger;
  private readonly adminFbEMail: string;

  constructor(
    @Inject('FIREBASE_APP') private firebaseApp: app.App,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(ChatFirebaseRepository.name);
    this.adminFbEMail = this.configService.get(
      'FB_ADMIN_USER',
      'sga@universae.com',
    );
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

  async getAdminUserByEmail(): Promise<UserRecord | null> {
    try {
      return await this.firebaseApp.auth().getUserByEmail(this.adminFbEMail);
    } catch (error) {
      this.logger.error(
        `Error user: ${this.adminFbEMail} doest not exists ${error}`,
      );

      return null;
    }
  }

  async createToken(): Promise<string | null> {
    try {
      const userRecord = await this.getAdminUserByEmail();
      if (!userRecord) {
        return null;
      }

      if (await this.existUserByEmail(userRecord.email!)) {
        return await this.firebaseApp.auth().createCustomToken(userRecord.uid);
      }

      return null;
    } catch (error) {
      this.logger.error(
        `Error getToken fb with user ${this.adminFbEMail}:  ${error}`,
      );

      return null;
    }
  }
}
