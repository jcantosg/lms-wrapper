import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { studentSchemas } from '#/student/schemas';
import { repositories } from '#/student/repositories';
import { handlers } from '#/student/handlers';
import { controllers } from '#/student/controllers';
import { services } from '#/student/services';

@Module({
  imports: [TypeOrmModule.forFeature(studentSchemas)],
  providers: [...repositories, ...handlers, ...services],
  exports: [...repositories, ...services],
  controllers: [...controllers],
})
export class StudentModule {}
