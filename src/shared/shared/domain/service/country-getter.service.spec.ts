import { Country } from '#shared/domain/entity/country.entity';
import { CountryNotFoundException } from '#shared/domain/exception/country/country-not-found.exception';
import { CountryRepository } from '#shared/domain/repository/country.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { getACountry } from '#test/entity-factory';
import { CountryMockRepository } from '#test/mocks/shared/country.mock-repository';

let service: CountryGetter;
let countryRepository: CountryRepository;

let getCountrySpy: any;

const country = getACountry();

describe('Admin User Getter', () => {
  beforeAll(() => {
    countryRepository = new CountryMockRepository();
    getCountrySpy = jest.spyOn(countryRepository, 'get');

    service = new CountryGetter(countryRepository);
  });

  it('Should return a country', async () => {
    getCountrySpy.mockImplementation((): Promise<Country | null> => {
      return Promise.resolve(country);
    });

    const result = await service.get('countryId');

    expect(result).toBe(country);
  });

  it('Should throw a CountryNotFoundException', async () => {
    getCountrySpy.mockImplementation((): Promise<Country | null> => {
      return Promise.resolve(null);
    });

    await expect(service.get('countryId')).rejects.toThrow(
      CountryNotFoundException,
    );
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});
