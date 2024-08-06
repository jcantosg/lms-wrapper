import {
  FactoryProvider,
  Global,
  Logger,
  Module,
  Provider,
} from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { repositories } from '#shared/repositories';
import { sharedSchemas } from '#shared/schemas';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { NestEventDispatcher } from '#shared/infrastructure/event/nest-event-dispatcher.service';
import { services } from '#shared/services';
import { handlers } from '#shared/handlers';
import { ConfigService } from '@nestjs/config';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { LocalStorageManager } from '#shared/infrastructure/file-manager/local-storage-manager';
import { AWSStorageManager } from '#shared/infrastructure/file-manager/aws-storage-manager';
import { controllers } from '#shared/controllers';
import { SGAStudentModule } from '#student/student.module';
import * as admin from 'firebase-admin';

const fileManager: FactoryProvider = {
  provide: FileManager,
  useFactory: (configService: ConfigService) => {
    const env = configService.get<string>('NODE_ENV', 'dev');

    if ('dev' === env || 'test' === env) {
      return new LocalStorageManager();
    }

    return new AWSStorageManager(
      configService.get<string>('AWS_BUCKET_NAME')!,
      configService.get<string>('AWS_REGION')!,
      configService.get<string>('MEDIA_DOMAIN_NAME')!,
      new Logger(),
    );
  },
  inject: [ConfigService],
};

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const firebaseConfig = {
      type: configService.get<string>('FB_TYPE'),
      project_id: configService.get<string>('FB_PROJECT_ID'),
      private_key_id: configService.get<string>('FB_PRIVATE_KEY_ID'),
      private_key: configService
        .get<string>('FB_PRIVATE_KEY')!
        .replace(/\\n/g, '\n'),
      client_email: configService.get<string>('FB_CLIENT_EMAIL'),
      client_id: configService.get<string>('FB_CLIENT_ID'),
      auth_uri: configService.get<string>('FB_AUTH_URI'),
      token_uri: configService.get<string>('FB_TOKEN_URI'),
      auth_provider_x509_cert_url: configService.get<string>(
        'FB_AUTH_PROVIDER_X509_CERT_URL',
      ),
      client_x509_cert_url: configService.get<string>(
        'FB_CLIENT_X509_CERT_URL',
      ),
      universe_domain: configService.get<string>('FB_UNIVERSE_DOMAIN'),
    } as admin.ServiceAccount;

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
      storageBucket: `${firebaseConfig.projectId}.appspot.com`,
    });
  },
};

const providers: Provider[] = [
  {
    provide: EventDispatcher,
    useClass: NestEventDispatcher,
  },
  ...repositories,
  ...services,
  ...handlers,
  fileManager,
  firebaseProvider,
];

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    TerminusModule,
    HttpModule,
    SGAStudentModule,
    TypeOrmModule.forFeature(sharedSchemas),
  ],
  providers,
  controllers: [...controllers],
  exports: [
    ...repositories,
    ...services,
    ...handlers,
    fileManager,
    firebaseProvider,
  ],
})
export class SharedModule {}
