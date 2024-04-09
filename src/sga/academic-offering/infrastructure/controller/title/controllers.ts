import { GetAllTitlesController } from '#academic-offering/infrastructure/controller/title/get-all-titles-list/get-title-list.controller';
import { GetAllTitlesPlainController } from '#academic-offering/infrastructure/controller/title/get-all-titles-plain/get-all-titles-plain.controller';
import { GetTitleDetailController } from '#academic-offering/infrastructure/controller/title/get-title-detail/get-title-detail.controller';
import { CreateTitleController } from '#academic-offering/infrastructure/controller/title/create-title.controller';
import { DeleteTitleController } from '#academic-offering/infrastructure/controller/title/delete-title.controller';
import { EditTitleController } from '#academic-offering/infrastructure/controller/title/edit-title.controller';
import { SearchTitleController } from '#academic-offering/infrastructure/controller/title/search-title.controller';

export const titleControllers = [
  GetAllTitlesController,
  GetAllTitlesPlainController,
  SearchTitleController,
  GetTitleDetailController,
  CreateTitleController,
  DeleteTitleController,
  EditTitleController,
];
