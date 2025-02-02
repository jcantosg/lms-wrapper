import { academicPeriodHandlers } from '#academic-offering/applicaton/academic-period/handlers';
import { academicProgramHandlers } from '#academic-offering/applicaton/academic-program/handlers';
import { evaluationTypeHandlers } from '#academic-offering/applicaton/evaluation-type/handlers';
import { subjectHandlers } from '#academic-offering/applicaton/subject/handlers';
import { titleHandlers } from '#academic-offering/applicaton/title/handlers';
import { programBlockHandlers } from '#academic-offering/applicaton/program-block/handlers';

export const handlers = [
  ...academicPeriodHandlers,
  ...academicProgramHandlers,
  ...evaluationTypeHandlers,
  ...subjectHandlers,
  ...titleHandlers,
  ...programBlockHandlers,
];
