import { academicPeriodHandlers } from '#academic-offering/applicaton/academic-period/handlers';
import { academicProgramHandlers } from '#academic-offering/applicaton/academic-program/handlers';
import { evaluationTypeHandlers } from '#academic-offering/applicaton/evaluation-type/handlers';
import { examinationCallHandlers } from '#academic-offering/applicaton/examination-call/handlers';
import { subjectHandlers } from '#academic-offering/applicaton/subject/handlers';
import { titleHandlers } from '#academic-offering/applicaton/title/handlers';
import { programBlockHandlers } from '#academic-offering/applicaton/program-block/handlers';
import { academicRecordHandlers } from '#academic-offering/applicaton/academic-record/handlers';

export const handlers = [
  ...academicPeriodHandlers,
  ...academicProgramHandlers,
  ...evaluationTypeHandlers,
  ...examinationCallHandlers,
  ...subjectHandlers,
  ...titleHandlers,
  ...programBlockHandlers,
  ...academicRecordHandlers,
];
