import { EntitySchema } from 'typeorm';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';

export const subjectCallSchema = new EntitySchema<SubjectCall>({
  name: 'SubjectCall',
  tableName: 'subject_calls',
  target: SubjectCall,
  columns: {
    ...BaseSchemaColumns,
    callNumber: {
      name: 'call_number',
      type: Number,
      default: 0,
      nullable: false,
    },
    callDate: {
      name: 'call_date',
      type: Date,
      nullable: false,
    },
    finalGrade: {
      name: 'final_grade',
      type: String,
      enum: SubjectCallFinalGradeEnum,
      nullable: false,
    },
    status: {
      type: String,
      enum: SubjectCallStatusEnum,
      nullable: false,
    },
  },
  relations: {
    ...BaseSchemaRelations,
    enrollment: {
      type: 'many-to-one',
      target: 'Enrollment',
      joinColumn: {
        name: 'enrollment_id',
      },
    },
  },
});
