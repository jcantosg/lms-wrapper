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
import { SGAStudentModule } from '#student/student.module';
import { JwtStrategy } from '#/student/student/infrastructure/auth/jwt.strategy';
import { StudentGetter } from '#shared/domain/service/student-getter.service';

const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: configService.get<string>('JWT_TTL') },
  }),
});

const jwtStrategy = {
  provide: JwtStrategy,
  useFactory: (configService: ConfigService, studentGetter: StudentGetter) => {
    const jwtSecret = configService.get<string>('JWT_SECRET')!;

    return new JwtStrategy(jwtSecret, studentGetter);
  },
  inject: [ConfigService, StudentGetter],
};

@Module({
  imports: [
    TypeOrmModule.forFeature(schemas),
    jwtModule,
    SharedModule,
    SGAStudentModule,
  ],
  providers: [
    ...repositories,
    ...services,
    ...handlers,
    LocalStrategy,
    ...listeners,
    jwtStrategy,
    {
      provide: EventDispatcher,
      useClass: NestEventDispatcher,
    },
  ],
  controllers: [...studentControllers],
  exports: [...repositories, ...services],
})
export class StudentModule {}
