import { EntitySchema } from 'typeorm';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';

export const virtualCampusSchema = new EntitySchema<VirtualCampus>({
  name: 'VirtualCampus',
  tableName: 'virtual_campus',
  target: VirtualCampus,
  columns: {
    ...BaseSchemaColumns,
    name: {
      type: String,
      nullable: false,
      unique: true,
    },
    code: {
      type: String,
      nullable: false,
      unique: true,
    },
    isActive: {
      type: Boolean,
      nullable: false,
      default: true,
      name: 'is_active',
    },
  },
  relations: {
    ...BaseSchemaRelations,
    businessUnit: {
      type: 'many-to-one',
      target: 'BusinessUnit',
      joinColumn: {
        name: 'business_unit_id',
      },
    },
  },
});
