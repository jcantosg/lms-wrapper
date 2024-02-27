import { EntitySchema } from 'typeorm';
import { BaseSchemaColumns } from '#shared/infrastructure/config/schema/base.schema';
import { IdentityDocument } from '#/sga/shared/domain/value-object/identity-document';
import { ValueObjectTransformer } from '#shared/infrastructure/value-object/value-object-transformer';
import { EdaeUser } from '#/sga/edae-user/domain/entity/edae-user.entity';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

export const edaeUserSchema = new EntitySchema<EdaeUser>({
  name: 'EdaeUser',
  target: EdaeUser,
  tableName: 'edae_users',
  columns: {
    ...BaseSchemaColumns,
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: String,
      nullable: false,
    },
    surname1: {
      type: String,
      nullable: false,
    },
    surname2: {
      type: String,
      nullable: true,
    },
    email: {
      type: String,
      unique: true,
      nullable: false,
    },
    identityDocument: {
      name: 'identity_document',
      type: 'json',
      nullable: false,
      transformer: ValueObjectTransformer(IdentityDocument),
    },
    roles: {
      type: 'enum',
      enum: EdaeRoles,
      array: true,
    },
    timeZone: {
      type: 'enum',
      enum: TimeZoneEnum,
      nullable: false,
    },
    isRemote: {
      type: Boolean,
      nullable: false,
    },
    avatar: {
      type: String,
      nullable: true,
    },
  },
  relations: {
    businessUnits: {
      type: 'many-to-many',
      target: 'business_units',
      joinTable: {
        name: 'edae_user_business_units',
        joinColumn: {
          name: 'edae_user_id',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'business_unit_id',
          referencedColumnName: 'id',
        },
      },
    },
    location: {
      type: 'many-to-one',
      target: 'countries',
      joinColumn: {
        name: 'location_id',
      },
    },
  },
});
