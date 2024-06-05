import Joi from 'joi';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';
import { getAllSubjectFinalCallGrades } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';

export const editSubjectCallSchema = Joi.object({
  month: Joi.number()
    .valid(
      ...Object.values(MonthEnum).filter((value) => typeof value === 'number'),
    )
    .required(),
  year: Joi.number().min(1900).max(3000).required(),
  finalGrade: Joi.string()
    .valid(...getAllSubjectFinalCallGrades())
    .required(),
});
