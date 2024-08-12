import { GetCountriesHandler } from '#shared/application/get-countries/get-countries.handler';
import { CountryRepository } from '#shared/domain/repository/country.repository';
import { GetProvincesHandler } from '#shared/application/get-provinces/get-provinces.handler';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { ProvinceGetter } from '#shared/domain/service/province-getter.service';
import { CreateCommunicationHandler } from '#shared/application/communication/create-communication/create-communication.handler';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { CreateChatUserHandler } from '#shared/application/create-chat-user/create-chat-user.handler';
import { ChatRepository } from '#shared/domain/repository/chat-repository';
import { DeleteChatUserHandler } from '#shared/application/delete-chat-user/delete-chat-user.handler';
import { ExistChatUserHandler } from '#shared/application/exist-chat-user/exist-chat-user.handler';
import { communicationHandlers } from '#shared/application/communication/handlers';

const getCountriesHandler = {
  provide: GetCountriesHandler,
  useFactory: (countryRepository: CountryRepository) =>
    new GetCountriesHandler(countryRepository),
  inject: [CountryRepository],
};

const getProvincesHandler = {
  provide: GetProvincesHandler,
  useFactory: (
    countryGetter: CountryGetter,
    provinceGetter: ProvinceGetter,
  ): GetProvincesHandler =>
    new GetProvincesHandler(countryGetter, provinceGetter),
  inject: [CountryGetter, ProvinceGetter],
};

const createCommunicationHandler = {
  provide: CreateCommunicationHandler,
  useFactory: (
    communicationRepository: CommunicationRepository,
    businessUnitGetter: BusinessUnitGetter,
    academicPeriodGetter: AcademicPeriodGetter,
    titleGetter: TitleGetter,
    academicProgramGetter: AcademicProgramGetter,
    internalGroupGetter: InternalGroupGetter,
    studentGetter: StudentGetter,
  ) =>
    new CreateCommunicationHandler(
      communicationRepository,
      businessUnitGetter,
      academicPeriodGetter,
      titleGetter,
      academicProgramGetter,
      internalGroupGetter,
      studentGetter,
    ),
  inject: [
    CommunicationRepository,
    BusinessUnitGetter,
    AcademicPeriodGetter,
    TitleGetter,
    AcademicProgramGetter,
    InternalGroupGetter,
    StudentGetter,
  ],
};

const createChatUserHandler = {
  provide: CreateChatUserHandler,
  useFactory: (chatRepository: ChatRepository) =>
    new CreateChatUserHandler(chatRepository),
  inject: [ChatRepository],
};

const deleteChatUserHandler = {
  provide: DeleteChatUserHandler,
  useFactory: (chatRepository: ChatRepository) =>
    new DeleteChatUserHandler(chatRepository),
  inject: [ChatRepository],
};

const existChatUserHandler = {
  provide: ExistChatUserHandler,
  useFactory: (chatRepository: ChatRepository) =>
    new ExistChatUserHandler(chatRepository),
  inject: [ChatRepository],
};

export const handlers = [
  getCountriesHandler,
  getProvincesHandler,
  createCommunicationHandler,
  createChatUserHandler,
  deleteChatUserHandler,
  existChatUserHandler,
  ...communicationHandlers,
];
