import { Module } from '@nestjs/common';
import { studentControllers } from '#/student/controllers';
import { services } from '#/student/services';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { handlers } from '#/student/handlers';
import { SharedModule } from '#shared/shared.module';
import { LocalStrategy } from '#/student/student/infrastructure/auth/local.strategy';
import { repositories } from '#/student/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { schemas } from '#/student/schemas';
import { listeners } from '#/student/listeners';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { NestEventDispatcher } from '#shared/infrastructure/event/nest-event-dispatcher.service';

const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: configService.get<string>('JWT_TTL') },
  }),
});

@Module({
  imports: [TypeOrmModule.forFeature(schemas), jwtModule, SharedModule],
  providers: [
    ...repositories,
    ...services,
    ...handlers,
    LocalStrategy,
    ...listeners,
    {
      provide: EventDispatcher,
      useClass: NestEventDispatcher,
    },
  ],
  controllers: [...studentControllers],
  exports: [...repositories, ...services],
})
export class StudentModule {}
