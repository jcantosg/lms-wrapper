import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { businessUnitSchemas } from './schemas';
import { repositories } from './repositories';
import { hanlders } from './handlers';

@Module({
  imports: [TypeOrmModule.forFeature(businessUnitSchemas)],
  providers: [...repositories, ...hanlders],
})
export class BusinessUnitModule {}
