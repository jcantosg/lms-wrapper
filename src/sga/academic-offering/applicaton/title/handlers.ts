import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import { CreateTitleHandler } from '#academic-offering/applicaton/title/create-title/create-title.handler';
import { GetTitleListHandler } from '#academic-offering/applicaton/title/get-all-titles/get-title-list.handler';
import { SearchTitleHandler } from '#academic-offering/applicaton/title/search-title/search-title.handler';
import { GetAllTitlesPlainHandler } from '#academic-offering/applicaton/title/get-all-titles-plain/get-all-titles-plain.handler';
import { DeleteTitleHandler } from '#academic-offering/applicaton/title/delete-title/delete-title.handler';
import { EditTitleHandler } from '#academic-offering/applicaton/title/edit-title/edit-title.handler';
import { GetTitleDetailHandler } from '#academic-offering/applicaton/title/get-title-detail/get-title-detail.handler';

const createTitleHandler = {
  provide: CreateTitleHandler,
  useFactory: (
    repository: TitleRepository,
    businessUnitGetter: BusinessUnitGetter,
  ) => new CreateTitleHandler(repository, businessUnitGetter),
  inject: [TitleRepository, BusinessUnitGetter],
};

const getAllTitlesHandler = {
  provide: GetTitleListHandler,
  useFactory: (repository: TitleRepository) =>
    new GetTitleListHandler(repository),
  inject: [TitleRepository],
};

const searchTitlesHandler = {
  provide: SearchTitleHandler,
  useFactory: (repository: TitleRepository) =>
    new SearchTitleHandler(repository),
  inject: [TitleRepository],
};

const getAllTitlesPlainHandler = {
  provide: GetAllTitlesPlainHandler,
  useFactory: (repository: TitleRepository) =>
    new GetAllTitlesPlainHandler(repository),
  inject: [TitleRepository],
};

const deleteTitleHandler = {
  provide: DeleteTitleHandler,
  useFactory: (
    repository: TitleRepository,
    getter: TitleGetter,
  ): DeleteTitleHandler => new DeleteTitleHandler(repository, getter),
  inject: [TitleRepository, TitleGetter],
};

const editTitleHandler = {
  provide: EditTitleHandler,
  useFactory: (
    titleRepository: TitleRepository,
    titleGetter: TitleGetter,
    businessUnitGetter: BusinessUnitGetter,
  ) => {
    return new EditTitleHandler(
      titleRepository,
      titleGetter,
      businessUnitGetter,
    );
  },
  inject: [TitleRepository, TitleGetter, BusinessUnitGetter],
};

const getTitleDetailHandler = {
  provide: GetTitleDetailHandler,
  useFactory: (titleGetter: TitleGetter) => {
    return new GetTitleDetailHandler(titleGetter);
  },
  inject: [TitleGetter],
};

export const titleHandlers = [
  createTitleHandler,
  getAllTitlesHandler,
  searchTitlesHandler,
  getTitleDetailHandler,
  getAllTitlesPlainHandler,
  deleteTitleHandler,
  editTitleHandler,
];
