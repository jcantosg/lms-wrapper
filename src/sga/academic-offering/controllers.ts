import { CreateAcademicPeriodController } from '#academic-offering/infrastructure/controller/create-academic-period.controller';
import { CreateExaminationCallController } from '#academic-offering/infrastructure/controller/create-examination-call.controller';
import { GetAllAcademicPeriodsController } from '#academic-offering/infrastructure/controller/get-all-academic-periods/get-all-academic-periods.controller';
import { SearchAcademicPeriodsController } from '#academic-offering/infrastructure/controller/search-academic-periods.controller';
import { GetEvaluationTypesController } from '#academic-offering/infrastructure/controller/get-evaluation-types/get-evaluation-types.controller';
import { GetAllSubjectModalitiesController } from '#academic-offering/infrastructure/controller/get-all-subject-modalities/get-all-subject-modalities.controller';
import { GetAllSubjectTypesController } from '#academic-offering/infrastructure/controller/get-all-subject-types/get-all-subject-types.controller';
import { CreateSubjectController } from '#academic-offering/infrastructure/controller/create-subject.controller';
import { EditAcademicPeriodController } from '#academic-offering/infrastructure/controller/edit-academic-period.controller';
import { GetAcademicPeriodController } from '#academic-offering/infrastructure/controller/get-academic-period.controller';
import { GetSubjectController } from '#academic-offering/infrastructure/controller/get-subject/get-subject.controller';
import { GetAllSubjectsController } from '#academic-offering/infrastructure/controller/get-all-subjects/get-all-subjects.controller';
import { SearchSubjectsController } from '#academic-offering/infrastructure/controller/search-subjects.controller';
import { EditSubjectController } from '#academic-offering/infrastructure/controller/edit-subject.controller';
import { EditExaminationCallController } from '#academic-offering/infrastructure/controller/edit-examination-call.controller';
import { CreateTitleController } from '#academic-offering/infrastructure/controller/create-title.controller';
import { DeleteExaminationCallController } from '#academic-offering/infrastructure/controller/delete-examination-call.controller';
import { CreateAcademicProgramController } from '#academic-offering/infrastructure/controller/create-academic-program.controller';
import { GetAllTitlesPlainController } from '#academic-offering/infrastructure/controller/get-all-titles-plain/get-all-titles-plain.controller';
import { UploadSubjectResourceController } from '#academic-offering/infrastructure/controller/upload-subject-resource.controller';
import { AddEdaeUsersToSubjectController } from '#academic-offering/infrastructure/controller/add-edae-users-to-subject.controller';
import { DeleteSubjectResourceController } from '#academic-offering/infrastructure/controller/delete-subject-resource.controller';
import { DeleteTitleController } from '#academic-offering/infrastructure/controller/delete-title.controller';

export const controllers = [
  CreateAcademicPeriodController,
  SearchAcademicPeriodsController,
  GetAllAcademicPeriodsController,
  CreateExaminationCallController,
  CreateSubjectController,
  GetAllSubjectModalitiesController,
  GetEvaluationTypesController,
  GetAllSubjectTypesController,
  EditAcademicPeriodController,
  GetAcademicPeriodController,
  GetAllSubjectsController,
  SearchSubjectsController,
  EditSubjectController,
  GetSubjectController,
  EditExaminationCallController,
  UploadSubjectResourceController,
  CreateTitleController,
  DeleteExaminationCallController,
  CreateAcademicProgramController,
  GetAllTitlesPlainController,
  AddEdaeUsersToSubjectController,
  DeleteSubjectResourceController,
  DeleteTitleController,
];
