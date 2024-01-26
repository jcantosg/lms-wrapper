import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { repositories } from '#admin-user/repositories';
import { adminUserSchemas } from '#admin-user/schemas';
import { services } from '#admin-user/services';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '#/sga/shared/infrastructure/auth/jwt.strategy';
import { LocalStrategy } from '#admin-user/infrastructure/auth/local.strategy';
import { handlers } from '#admin-user/handlers';
import { controllers } from '#admin-user/controllers';
import { BusinessUnitModule } from '#business-unit/business-unit.module';

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
  useFactory: (configService: ConfigService) => {
    const jwtSecret = configService.get<string>('JWT_SECRET')!;

    return new JwtStrategy(jwtSecret);
  },
  inject: [ConfigService],
};
@Module({
  imports: [
    TypeOrmModule.forFeature(adminUserSchemas),
    jwtModule,
    BusinessUnitModule,
  ],
  providers: [
    ...repositories,
    ...services,
    ...handlers,
    LocalStrategy,
    jwtStrategy,
  ],
  exports: [...repositories, ...services],
  controllers: [...controllers],
})
export class AdminUserModule {}
