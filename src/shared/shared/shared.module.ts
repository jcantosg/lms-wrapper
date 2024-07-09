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

const providers: Provider[] = [
  {
    provide: EventDispatcher,
    useClass: NestEventDispatcher,
  },
  ...repositories,
  ...services,
  ...handlers,
  fileManager,
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
  exports: [...repositories, ...services, fileManager],
})
export class SharedModule {}
