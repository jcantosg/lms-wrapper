import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { CreateAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/create-academic-program/create-academic-program.handler';
import { GetAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/get-academic-program/get-academic-program.handler';
import { SearchAcademicProgramsHandler } from '#academic-offering/applicaton/academic-program/search-academic-programs/search-academic-programs.handler';
import { GetAllAcademicProgramsHandler } from '#academic-offering/applicaton/academic-program/get-all-academic-programs/get-all-academic-programs.handler';
import { EditAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/edit-academic-program/edit-academic-program.handler';
import { RemoveAcademicProgramFromAcademicPeriodHandler } from '#academic-offering/applicaton/academic-program/remove-academic-program-from-academic-period/remove-academic-program-from-academic-period.handler';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { SearchAcademicProgramsByTitleHandler } from '#academic-offering/applicaton/academic-program/search-academic-programs-by-title/search-academic-programs-by-title.handler';
import { GetAllAcademicProgramsPlainHandler } from '#academic-offering/applicaton/academic-program/get-all-academic-programs-plain/get-all-academic-programs-plain.handler';
import { AddAcademicProgramToAcademicPeriodHandler } from '#academic-offering/applicaton/academic-program/add-academic-program-to-academic-period/add-academic-program-to-academic-period.handler';
import { GetAcademicProgramsByTitleHandler } from '#academic-offering/applicaton/academic-program/get-academic-programs-by-title/get-academic-programs-by-title.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';

const createAcademicProgramHandler = {
  provide: CreateAcademicProgramHandler,
  useFactory: (
    academicProgramRepository: AcademicProgramRepository,
    programBlockRepository: ProgramBlockRepository,
    businessUnitGetter: BusinessUnitGetter,
    titleGetter: TitleGetter,
  ) =>
    new CreateAcademicProgramHandler(
      academicProgramRepository,
      programBlockRepository,
      businessUnitGetter,
      titleGetter,
    ),
  inject: [
    AcademicProgramRepository,
    ProgramBlockRepository,
    BusinessUnitGetter,
    TitleGetter,
  ],
};
const getAcademicProgramHandler = {
  provide: GetAcademicProgramHandler,
  useFactory: (getter: AcademicProgramGetter) => {
    return new GetAcademicProgramHandler(getter);
  },
  inject: [AcademicProgramGetter],
};

const getAllAcademicProgramsHandler = {
  provide: GetAllAcademicProgramsHandler,
  useFactory: (repository: AcademicProgramRepository) =>
    new GetAllAcademicProgramsHandler(repository),
  inject: [AcademicProgramRepository],
};

const searchAcademicProgramsHandler = {
  provide: SearchAcademicProgramsHandler,
  useFactory: (repository: AcademicProgramRepository) =>
    new SearchAcademicProgramsHandler(repository),
  inject: [AcademicProgramRepository],
};

const editAcademicProgramHandler = {
  provide: EditAcademicProgramHandler,
  useFactory: (
    academicProgramRepository: AcademicProgramRepository,
    academicProgramGetter: AcademicProgramGetter,
    titleGetter: TitleGetter,
  ) => {
    return new EditAcademicProgramHandler(
      academicProgramRepository,
      academicProgramGetter,
      titleGetter,
    );
  },
  inject: [AcademicProgramRepository, AcademicProgramGetter, TitleGetter],
};

const removeAcademicProgramFromAcademicPeriodHandler = {
  provide: RemoveAcademicProgramFromAcademicPeriodHandler,
  useFactory: (
    academicPeriodGetter: AcademicPeriodGetter,
    academicProgramGetter: AcademicProgramGetter,
    repository: AcademicPeriodRepository,
  ) => {
    return new RemoveAcademicProgramFromAcademicPeriodHandler(
      academicPeriodGetter,
      academicProgramGetter,
      repository,
    );
  },
  inject: [
    AcademicPeriodGetter,
    AcademicProgramGetter,
    AcademicPeriodRepository,
  ],
};

const getAcademicProgramsByTitleHandler = {
  provide: GetAcademicProgramsByTitleHandler,
  useFactory: (
    repository: AcademicProgramRepository,
    titleRepository: TitleRepository,
  ) => new GetAcademicProgramsByTitleHandler(repository, titleRepository),
  inject: [AcademicProgramRepository, TitleRepository],
};

const searchAcademicProgramsByTitleHandler = {
  provide: SearchAcademicProgramsByTitleHandler,
  useFactory: (
    repository: AcademicProgramRepository,
    titleRepository: TitleRepository,
  ) => new SearchAcademicProgramsByTitleHandler(repository, titleRepository),
  inject: [AcademicProgramRepository, TitleRepository],
};

const getAllAcademicProgramsPlainHandler = {
  provide: GetAllAcademicProgramsPlainHandler,
  useFactory: (academicProgramRepository: AcademicProgramRepository) =>
    new GetAllAcademicProgramsPlainHandler(academicProgramRepository),
  inject: [AcademicProgramRepository],
};

const addAcademicProgramsToAcademicPeriodHandler = {
  provide: AddAcademicProgramToAcademicPeriodHandler,
  useFactory: (
    academicPeriodRepository: AcademicPeriodRepository,
    academicPeriodGetter: AcademicPeriodGetter,
    academicProgramGetter: AcademicProgramGetter,
  ) =>
    new AddAcademicProgramToAcademicPeriodHandler(
      academicPeriodRepository,
      academicPeriodGetter,
      academicProgramGetter,
    ),
  inject: [
    AcademicPeriodRepository,
    AcademicPeriodGetter,
    AcademicProgramGetter,
  ],
};

export const academicProgramHandlers = [
  createAcademicProgramHandler,
  getAcademicProgramHandler,
  getAllAcademicProgramsHandler,
  getAllAcademicProgramsPlainHandler,
  searchAcademicProgramsHandler,
  editAcademicProgramHandler,
  removeAcademicProgramFromAcademicPeriodHandler,
  getAcademicProgramsByTitleHandler,
  searchAcademicProgramsByTitleHandler,
  addAcademicProgramsToAcademicPeriodHandler,
];
