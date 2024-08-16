import { EntitySchema } from 'typeorm';
import { Communication } from '#shared/domain/entity/communication.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { CommunicationStatus } from '#shared/domain/enum/communication-status.enum';
import { ValueObjectTransformer } from '#shared/infrastructure/value-object/value-object-transformer';
import { Message } from '#shared/domain/value-object/message.value-object';

export const CommunicationSchema = new EntitySchema<Communication>({
  name: 'Communication',
  target: Communication,
  tableName: 'communications',
  columns: {
    ...BaseSchemaColumns,
    sentAt: {
      type: 'timestamp',
      nullable: true,
      name: 'sent_at',
    },
    sendByEmail: {
      type: 'boolean',
      nullable: true,
      name: 'send_by_email',
    },
    publishOnBoard: {
      type: 'boolean',
      nullable: true,
      name: 'publish_on_board',
    },
    status: {
      type: 'enum',
      nullable: true,
      enum: CommunicationStatus,
    },
    message: {
      type: 'json',
      nullable: true,
      transformer: ValueObjectTransformer(Message),
    },
  },
  relations: {
    ...BaseSchemaRelations,
    sentBy: {
      type: 'many-to-one',
      target: 'AdminUser',
      nullable: true,
      joinColumn: {
        name: 'sent_by_id',
      },
    },
    businessUnits: {
      type: 'many-to-many',
      target: 'BusinessUnit',
      joinTable: {
        name: 'communication_business_units',
        joinColumn: {
          name: 'communication_id',
        },
        inverseJoinColumn: {
          name: 'business_unit_id',
        },
      },
    },
    academicPeriods: {
      type: 'many-to-many',
      target: 'AcademicPeriod',
      joinTable: {
        name: 'communication_academic_periods',
        joinColumn: {
          name: 'communication_id',
        },
        inverseJoinColumn: {
          name: 'academic_period_id',
        },
      },
    },
    titles: {
      type: 'many-to-many',
      target: 'Title',
      joinTable: {
        name: 'communication_titles',
        joinColumn: {
          name: 'communication_id',
        },
        inverseJoinColumn: {
          name: 'title_id',
        },
      },
    },
    academicPrograms: {
      type: 'many-to-many',
      target: 'AcademicProgram',
      joinTable: {
        name: 'communication_academic_programs',
        joinColumn: {
          name: 'communication_id',
        },
        inverseJoinColumn: {
          name: 'academic_program_id',
        },
      },
    },
    internalGroups: {
      type: 'many-to-many',
      target: 'InternalGroup',
      joinTable: {
        name: 'communication_internal_groups',
        joinColumn: {
          name: 'communication_id',
        },
        inverseJoinColumn: {
          name: 'internal_group_id',
        },
      },
    },
  },
});
