import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { services } from '#/teacher/services';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { JwtStrategy } from '#/teacher/infrastructure/auth/jwt.strategy';
import { EdaeUserModule } from '#edae-user/edae-user.module';
import { edaeUserControllers } from '#/teacher/controllers';
import { SharedModule } from '#shared/shared.module';
import { LocalStrategy } from '#/teacher/infrastructure/auth/local.strategy';
import { handlers } from '#/teacher/handlers';
import { schemas } from '#/teacher/schemas';
import { repositories } from '#/teacher/repositories';
import { SGAStudentModule } from '#student/student.module';
import { AcademicOfferingModule } from '#academic-offering/academic-offering.module';

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
  useFactory: (
    configService: ConfigService,
    edaeUserGetter: EdaeUserGetter,
  ) => {
    const jwtSecret = configService.get<string>('JWT_SECRET')!;

    return new JwtStrategy(jwtSecret, edaeUserGetter);
  },
  inject: [ConfigService, EdaeUserGetter],
};
@Module({
  imports: [
    TypeOrmModule.forFeature(schemas),
    jwtModule,
    SharedModule,
    EdaeUserModule,
    SGAStudentModule,
    AcademicOfferingModule,
  ],
  providers: [
    ...services,
    ...repositories,
    ...handlers,
    jwtStrategy,
    LocalStrategy,
  ],
  controllers: [...edaeUserControllers],
})
export class TeacherModule {}
