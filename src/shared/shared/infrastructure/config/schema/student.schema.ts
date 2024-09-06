import { EntitySchema } from 'typeorm';
import { Student } from '#shared/domain/entity/student.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { StudentGender } from '#shared/domain/enum/student-gender.enum';
import { ValueObjectTransformer } from '#shared/infrastructure/value-object/value-object-transformer';
import { IdentityDocument } from '#/sga/shared/domain/value-object/identity-document';
import { StudentStatus } from '#shared/domain/enum/student-status.enum';
import { StudentOrigin } from '#shared/domain/enum/student-origin.enum.';
import { AccessQualification } from '#shared/domain/enum/access-qualification.enum';
import { LmsStudent } from '#/lms-wrapper/domain/entity/lms-student';

export const studentSchema = new EntitySchema<Student>({
  name: 'Student',
  target: Student,
  tableName: 'students',
  columns: {
    ...BaseSchemaColumns,
    name: {
      type: String,
      nullable: false,
    },
    surname: {
      type: String,
      nullable: false,
    },
    surname2: {
      type: String,
      nullable: false,
    },
    email: {
      type: String,
      nullable: false,
    },
    universaeEmail: {
      type: String,
      nullable: false,
    },
    avatar: {
      type: String,
      nullable: true,
    },
    birthDate: {
      type: Date,
      nullable: true,
    },
    gender: {
      type: String,
      enum: StudentGender,
      nullable: true,
    },
    identityDocument: {
      name: 'identity_document',
      type: 'json',
      nullable: true,
      transformer: ValueObjectTransformer(IdentityDocument),
      default: {},
    },
    socialSecurityNumber: {
      name: 'social_security_number',
      type: String,
      nullable: true,
    },
    status: {
      type: String,
      enum: StudentStatus,
      nullable: false,
    },
    isActive: {
      type: Boolean,
      nullable: false,
      default: true,
    },
    origin: {
      type: String,
      enum: StudentOrigin,
      nullable: false,
      default: StudentOrigin.SGA,
    },
    crmId: {
      name: 'crm_id',
      type: String,
      nullable: true,
    },
    accessQualification: {
      name: 'access_qualification',
      type: String,
      enum: AccessQualification,
      nullable: true,
    },
    niaIdalu: {
      name: 'nia_idalu',
      type: String,
      nullable: true,
    },
    phone: {
      type: String,
      nullable: true,
    },
    state: {
      type: String,
      nullable: true,
    },
    city: {
      type: String,
      nullable: true,
    },
    address: {
      type: String,
      nullable: true,
    },
    guardianName: {
      type: String,
      nullable: true,
    },
    guardianSurname: {
      type: String,
      nullable: true,
    },
    guardianEmail: {
      type: String,
      nullable: true,
    },
    guardianPhone: {
      type: String,
      nullable: true,
    },
    password: {
      type: String,
      nullable: true,
    },
    lmsStudent: {
      name: 'lms_student',
      type: 'json',
      nullable: true,
      transformer: ValueObjectTransformer(LmsStudent),
      default: {},
    },
    isDefense: {
      type: Boolean,
      nullable: false,
      default: false,
    },
  },
  relations: {
    ...BaseSchemaRelations,
    country: {
      type: 'many-to-one',
      target: 'Country',
      joinColumn: {
        name: 'country_id',
      },
      nullable: true,
    },
    citizenship: {
      type: 'many-to-one',
      target: 'Country',
      joinColumn: {
        name: 'citizenship_id',
      },
      nullable: true,
    },
    contactCountry: {
      type: 'many-to-one',
      target: 'Country',
      joinColumn: {
        name: 'contact_country_id',
      },
      nullable: true,
    },
    academicRecords: {
      type: 'one-to-many',
      target: 'AcademicRecord',
      inverseSide: 'student',
    },
    administrativeGroups: {
      type: 'many-to-many',
      target: 'AdministrativeGroup',
      joinTable: {
        name: 'administrative_group_students',
        joinColumn: {
          name: 'student_id',
        },
        inverseJoinColumn: {
          name: 'administrative_group_id',
        },
      },
    },
    internalGroups: {
      type: 'many-to-many',
      target: 'InternalGroup',
      joinTable: {
        name: 'internal_group_students',
        joinColumn: {
          name: 'student_id',
        },
        inverseJoinColumn: {
          name: 'internal_group_id',
        },
      },
    },
    communications: {
      type: 'one-to-many',
      target: 'CommunicationStudent',
      inverseSide: 'student',
    },
  },
});
