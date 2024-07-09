import { forwardRef, Module } from '@nestjs/common';
import { SharedModule } from '#shared/shared.module';
import { repositories } from '#/lms-wrapper/repositories';
import { services } from '#/lms-wrapper/infrastructure/services';
import { handlers } from '#/lms-wrapper/handlers';
import { lmsWrapperControllers } from '#/lms-wrapper/infrastructure/controller/controllers';
import { AcademicOfferingModule } from '#academic-offering/academic-offering.module';

@Module({
  imports: [
    forwardRef(() => SharedModule),
    forwardRef(() => AcademicOfferingModule),
  ],
  controllers: [...lmsWrapperControllers],
  providers: [...repositories, ...services, ...handlers],
  exports: [...handlers],
})
export class LmsWrapperModule {}
