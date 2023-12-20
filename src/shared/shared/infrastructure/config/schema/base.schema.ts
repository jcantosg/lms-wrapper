import {
  EntitySchemaColumnOptions,
  EntitySchemaRelationOptions,
} from 'typeorm';

export const BaseSchemaRelations = {
  createdBy: {
    type: 'many-to-one',
    target: 'AdminUser',
    joinColumn: {
      name: 'created_by_id',
    },
  } as EntitySchemaRelationOptions,
  updatedBy: {
    type: 'many-to-one',
    target: 'AdminUser',
    joinColumn: {
      name: 'updated_by_id',
    },
  } as EntitySchemaRelationOptions,
};

export const BaseSchemaColumns = {
  id: {
    type: String,
    primary: true,
  } as EntitySchemaColumnOptions,
  createdAt: {
    name: 'created_at',
    type: 'timestamp',
    createDate: true,
  } as EntitySchemaColumnOptions,
  updatedAt: {
    name: 'updated_at',
    type: 'timestamp',
    updateDate: true,
  } as EntitySchemaColumnOptions,
};
