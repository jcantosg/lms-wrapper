import { GetAllSubjectModalitiesController } from '#academic-offering/infrastructure/controller/subject/get-all-subject-modalities/get-all-subject-modalities.controller';
import { GetAllSubjectTypesController } from '#academic-offering/infrastructure/controller/subject/get-all-subject-types/get-all-subject-types.controller';
import { GetAllSubjectsController } from '#academic-offering/infrastructure/controller/subject/get-all-subjects/get-all-subjects.controller';
import { AddEdaeUsersToSubjectController } from '#academic-offering/infrastructure/controller/subject/add-edae-users-to-subject.controller';
import { CreateSubjectController } from '#academic-offering/infrastructure/controller/subject/create-subject.controller';
import { DeleteSubjectResourceController } from '#academic-offering/infrastructure/controller/subject/delete-subject-resource.controller';
import { EditSubjectController } from '#academic-offering/infrastructure/controller/subject/edit-subject.controller';
import { SearchSubjectsController } from '#academic-offering/infrastructure/controller/subject/search-subjects.controller';
import { UploadSubjectResourceController } from '#academic-offering/infrastructure/controller/subject/upload-subject-resource.controller';
import { RemoveEdaeUserFromSubjectController } from '#academic-offering/infrastructure/controller/subject/remove-edae-user-from-subject.controller';
import { GetSubjectController } from '#academic-offering/infrastructure/controller/subject/get-subject/get-subject.controller';
import { GetSubjectByBusinessUnitController } from '#academic-offering/infrastructure/controller/subject/get-subjects-by-business-unit/get-subject-by-business-unit.controller';

export const subjectControllers = [
  GetAllSubjectModalitiesController,
  GetAllSubjectTypesController,
  GetAllSubjectsController,
  AddEdaeUsersToSubjectController,
  CreateSubjectController,
  DeleteSubjectResourceController,
  EditSubjectController,
  SearchSubjectsController,
  UploadSubjectResourceController,
  RemoveEdaeUserFromSubjectController,
  GetSubjectByBusinessUnitController,
  GetSubjectController,
];
