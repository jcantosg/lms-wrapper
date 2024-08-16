import { GetCountriesHandler } from '#shared/application/get-countries/get-countries.handler';
import { CountryRepository } from '#shared/domain/repository/country.repository';
import { GetProvincesHandler } from '#shared/application/get-provinces/get-provinces.handler';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { ProvinceGetter } from '#shared/domain/service/province-getter.service';
import { CreateChatUserHandler } from '#shared/application/create-chat-user/create-chat-user.handler';
import { ChatRepository } from '#shared/domain/repository/chat-repository';
import { DeleteChatUserHandler } from '#shared/application/delete-chat-user/delete-chat-user.handler';
import { ExistChatUserHandler } from '#shared/application/exist-chat-user/exist-chat-user.handler';
import { communicationHandlers } from '#shared/application/communication/handlers';
import { GetCitiesHandler } from '#shared/application/get-cities/get-cities.handler';
import { CityGetter } from '#shared/domain/service/city-getter.service';

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
const getCitiesHandler = {
  provide: GetCitiesHandler,
  useFactory: (
    countryGetter: CountryGetter,
    cityGetter: CityGetter,
  ): GetCitiesHandler => new GetCitiesHandler(countryGetter, cityGetter),
  inject: [CountryGetter, CityGetter],
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
  getCitiesHandler,
  createChatUserHandler,
  deleteChatUserHandler,
  existChatUserHandler,
  ...communicationHandlers,
];
