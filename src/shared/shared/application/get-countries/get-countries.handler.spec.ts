import { Country } from '#shared/domain/entity/country.entity';
import { CountryRepository } from '#shared/domain/repository/country.repository';
import { GetCountriesHandler } from './get-countries.handler';
import { getACountry } from '#test/entity-factory';
import { CountryMockRepository } from '#test/mocks/shared/country.mock-repository';

let handler: GetCountriesHandler;
let countryRepository: CountryRepository;

let getSpy: any;

const countryId = 'c0c2c9e0-0b1e-4b7a-8b4a-6b1d1b1b1b1b';
const countries = [getACountry(countryId)];

describe('Get Countries Handler', () => {
  beforeAll(() => {
    countryRepository = new CountryMockRepository();

    getSpy = jest.spyOn(countryRepository, 'getAll');

    handler = new GetCountriesHandler(countryRepository);
  });

  it('should get all countries without filter', async () => {
    getSpy.mockImplementation(
      (): Promise<Country[]> => Promise.resolve(countries),
    );

    const expectedCountries = await handler.handle({ filter: '' });

    expect(expectedCountries[0]).toEqual(
      expect.objectContaining({
        id: countryId,
        name: 'España',
        emoji: '🇪🇸',
      }),
    );
  });

  it('should get all countries with businessUnit filter', async () => {
    getSpy.mockImplementation(
      (): Promise<Country[]> => Promise.resolve(countries),
    );

    const expectedCountries = await handler.handle({ filter: 'businessUnit' });

    expect(expectedCountries[0]).toEqual(
      expect.objectContaining({
        id: countryId,
        name: 'España',
        emoji: '🇪🇸',
      }),
    );
  });
});
