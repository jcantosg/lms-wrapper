import { FactoryProvider, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { academicPeriodSchemas } from '#academic-offering/schemas';
import { repositories } from '#academic-offering/repositories';
import { handlers } from '#academic-offering/handlers';
import { BusinessUnitModule } from '#business-unit/business-unit.module';
import { controllers } from '#academic-offering/controllers';
import { services } from '#academic-offering/services';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { ConfigService } from '@nestjs/config';
import { LocalStorageManager } from '#shared/infrastructure/file-manager/local-storage-manager';
import { AWSStorageManager } from '#shared/infrastructure/file-manager/aws-storage-manager';

const fileManager: FactoryProvider = {
  provide: FileManager,
  useFactory: (configService: ConfigService) => {
    const env = configService.get<string>('NODE_ENV', 'dev');

    if ('dev' === env || 'test' === env) {
      return new LocalStorageManager();
    }

    return new AWSStorageManager(
      configService.get<string>('AWS_ACCESS_KEY')!,
      configService.get<string>('AWS_SECRET_KEY')!,
      configService.get<string>('AWS_BUCKET_NAME')!,
      configService.get<string>('AWS_REGION')!,
    );
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    TypeOrmModule.forFeature(academicPeriodSchemas),
    BusinessUnitModule,
  ],
  providers: [...repositories, ...handlers, ...services, fileManager],
  controllers: [...controllers],
  exports: [...services],
})
export class AcademicOfferingModule {}
