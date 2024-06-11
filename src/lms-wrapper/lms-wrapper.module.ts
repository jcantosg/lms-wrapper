import { Module } from '@nestjs/common';
import { SharedModule } from '#shared/shared.module';
import { repositories } from '#/lms-wrapper/repositories';
import { services } from '#/lms-wrapper/infrastructure/services';
import { handlers } from '#/lms-wrapper/handlers';

@Module({
  imports: [SharedModule],
  providers: [...repositories, ...services, ...handlers],
  exports: [...handlers],
})
export class LmsWrapperModule {}
