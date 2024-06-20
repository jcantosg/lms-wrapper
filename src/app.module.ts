import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { DataSourceOptions } from 'typeorm';
import { Request } from 'express';
import { APP_FILTER } from '@nestjs/core';
import { apiDbConfig } from '#config/database.config';
import {
  CORRELATION_ID_HEADER,
  CorrelationIdMiddleware,
} from '#shared/infrastructure/middleware/correlation-id.middleware';
import { SharedModule } from '#shared/shared.module';
import { ApplicationExceptionFilter } from '#shared/infrastructure/filter/exception.filter';
import { EnvironmentHeaderMiddleware } from '#shared/infrastructure/middleware/environment-header.middleware';
import { VersionHeaderMiddleware } from '#shared/infrastructure/middleware/version-header.middleware';
import { SGAModule } from '#/sga/sga.module';
import { StudentModule } from '#/student/student.module';
import { TeacherModule } from '#/teacher/Teacher.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EdaeUserModule } from '#edae-user/edae-user.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {
  AcceptLanguageResolver,
  I18nModule,
  I18nService,
  QueryResolver,
} from 'nestjs-i18n';
import { LmsWrapperModule } from '#/lms-wrapper/lms-wrapper.module';

const env = process.env.NODE_ENV;
const envFile = fs.existsSync(`.env.${env}`) ? `.env.${env}` : '.env';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: envFile,
  validationSchema: Joi.object({
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required(),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    VERBOSE_MODE: Joi.boolean().required(),
    APP_STABLE_VERSION: Joi.string().required(),
    REFRESH_TOKEN_TTL: Joi.number().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_TTL: Joi.string().required(),
    DEFAULT_AVATAR: Joi.string().required(),
    EMAIL_HOST: Joi.string().required(),
    EMAIL_PORT: Joi.number().required(),
    FROM_EMAIL: Joi.string().required(),
    FROM_EMAIL_PASS: Joi.string().required(),
    AWS_BUCKET_NAME: Joi.string().required(),
    AWS_REGION: Joi.string().required(),
    APP_URL: Joi.string().required(),
    RECOVERY_TOKEN_TTL: Joi.number().required(),
    GEONAMES_URL: Joi.string().required(),
    GEONAMES_NAME: Joi.string().required(),
    STUDENT_RECOVERY_PASSWORD_TOKEN_URL: Joi.string().required(),
    STUDENT_RECOVERY_PASSWORD_TTL: Joi.number().required(),
    CRM_IMPORTS_PATH: Joi.string().required(),
  }),
});

const typeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): DataSourceOptions =>
    apiDbConfig(
      configService.getOrThrow<string>('DATABASE_HOST'),
      configService.getOrThrow<number>('DATABASE_PORT'),
      configService.getOrThrow<string>('DATABASE_USER'),
      configService.getOrThrow<string>('DATABASE_PASSWORD'),
      configService.getOrThrow<string>('DATABASE_NAME'),
      configService.get<boolean>('VERBOSE_MODE', false),
    ),
  inject: [ConfigService],
});

const loggerModule = LoggerModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    pinoHttp: {
      transport:
        'develop' === configService.get<string>('NODE_ENV')
          ? {
              target: 'pino-pretty',
              options: {
                messageKey: 'message',
              },
            }
          : undefined,
      messageKey: 'message',
      customProps: (req: Request) => {
        return {
          correlationId: req.headers[CORRELATION_ID_HEADER],
        };
      },
      autoLogging: false,
      serializers: {
        req: () => undefined,
        res: () => undefined,
      },
    },
  }),
  inject: [ConfigService],
});

const i18nModule = I18nModule.forRoot({
  fallbackLanguage: 'es',
  loaderOptions: {
    path: __dirname + '/../i18n/',
    watch: true,
  },
  resolvers: [
    { use: QueryResolver, options: ['lang'] },
    AcceptLanguageResolver,
  ],
});

const mailerModule = MailerModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService, i18n: I18nService) => ({
    transport: {
      host: configService.getOrThrow<string>('EMAIL_HOST'),
      port: configService.getOrThrow<number>('EMAIL_PORT'),
      auth: {
        user: configService.getOrThrow<string>('FROM_EMAIL'),
        pass: configService.getOrThrow<string>('FROM_EMAIL_PASS'),
      },
    },
    defaults: {
      from: configService.getOrThrow<string>('FROM_EMAIL'),
    },
    template: {
      dir: __dirname + '/../templates',
      adapter: new HandlebarsAdapter({ t: i18n.hbsHelper }),
      options: {
        strict: true,
      },
    },
  }),
  inject: [ConfigService, I18nService],
});

@Module({
  imports: [
    configModule,
    typeOrmModule,
    loggerModule,
    SharedModule,
    SGAModule,
    StudentModule,
    TeacherModule,
    i18nModule,
    mailerModule,
    EdaeUserModule,
    LmsWrapperModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ApplicationExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(EnvironmentHeaderMiddleware).forRoutes('*');
    consumer.apply(VersionHeaderMiddleware).forRoutes('*');
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
