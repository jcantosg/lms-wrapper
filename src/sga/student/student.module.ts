import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { studentSchemas } from '#student/schemas';
import { repositories } from '#student/repositories';
import { handlers } from '#student/handlers';
import { controllers } from '#student/controllers';
import { services } from '#student/services';
import { BusinessUnitModule } from '#business-unit/business-unit.module';
import { AcademicOfferingModule } from '#academic-offering/academic-offering.module';
import { SharedModule } from '#shared/shared.module';
import { EdaeUserModule } from '#edae-user/edae-user.module';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { NestEventDispatcher } from '#shared/infrastructure/event/nest-event-dispatcher.service';
import { listeners } from '#student/listeners';
import { AdminUserModule } from '#admin-user/admin-user.module';
import { LmsWrapperModule } from '#/lms-wrapper/lms-wrapper.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(studentSchemas),
    forwardRef(() => BusinessUnitModule),
    EdaeUserModule,
    forwardRef(() => AcademicOfferingModule),
    forwardRef(() => SharedModule),
    LmsWrapperModule,
    forwardRef(() => AdminUserModule),
  ],
  providers: [
    ...repositories,
    ...handlers,
    ...services,
    ...listeners,
    {
      provide: EventDispatcher,
      useClass: NestEventDispatcher,
    },
  ],
  exports: [...repositories, ...services],
  controllers: [...controllers],
})
export class SGAStudentModule {}
