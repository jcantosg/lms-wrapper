import { CreateAcademicPeriodController } from '#academic-offering/infrastructure/controller/create-academic-period.controller';
import { GetAllAcademicPeriodsController } from '#academic-offering/infrastructure/controller/get-all-academic-periods/get-all-academic-periods.controller';
import { SearchAcademicPeriodsController } from '#academic-offering/infrastructure/controller/search-academic-periods.controller';
import { GetEvaluationTypesController } from '#academic-offering/infrastructure/controller/get-evaluation-types/get-evaluation-types.controller';
import { GetAllSubjectModalitiesController } from '#academic-offering/infrastructure/controller/get-all-subject-modalities/get-all-subject-modalities.controller';
import { GetAllSubjectTypesController } from '#academic-offering/infrastructure/controller/get-all-subject-types/get-all-subject-types.controller';
import { CreateSubjectController } from '#academic-offering/infrastructure/controller/create-subject.controller';
import { GetAllSubjectsController } from '#academic-offering/infrastructure/controller/get-all-subjects/get-all-subjects.controller';
import { SearchSubjectsController } from '#academic-offering/infrastructure/controller/search-subjects.controller';
import { EditSubjectController } from '#academic-offering/infrastructure/controller/edit-subject.controller';

export const controllers = [
  CreateAcademicPeriodController,
  SearchAcademicPeriodsController,
  GetAllAcademicPeriodsController,
  CreateSubjectController,
  GetAllSubjectModalitiesController,
  GetEvaluationTypesController,
  GetAllSubjectTypesController,
  GetAllSubjectsController,
  SearchSubjectsController,
  EditSubjectController,
];
