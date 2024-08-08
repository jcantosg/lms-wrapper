import { EntitySchema } from 'typeorm';
import { BaseSchemaColumns } from '#shared/infrastructure/config/schema/base.schema';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';
import { AdministrativeProcessFile } from '#student/domain/entity/administrative-process-file';
import { ValueObjectTransformer } from '#shared/infrastructure/value-object/value-object-transformer';

export const administrativeProcessSchema =
  new EntitySchema<AdministrativeProcess>({
    name: 'AdministrativeProcess',
    tableName: 'administrative_processes',
    target: AdministrativeProcess,
    columns: {
      ...BaseSchemaColumns,
      type: {
        type: 'enum',
        enum: AdministrativeProcessTypeEnum,
        nullable: false,
      },
      status: {
        type: 'enum',
        enum: AdministrativeProcessStatusEnum,
        nullable: false,
      },
      files: {
        name: 'files',
        type: 'simple-array',
        nullable: true,
        transformer: ValueObjectTransformer(AdministrativeProcessFile),
      },
    },
    relations: {
      student: {
        type: 'many-to-one',
        target: 'Student',
        joinColumn: {
          name: 'student_id',
        },
      },
      academicRecord: {
        type: 'many-to-one',
        target: 'AcademicRecord',
        joinColumn: {
          name: 'academic_record_id',
        },
      },
      businessUnit: {
        type: 'many-to-one',
        target: 'BusinessUnit',
        joinColumn: {
          name: 'business_unit_id',
        },
      },
    },
  });
