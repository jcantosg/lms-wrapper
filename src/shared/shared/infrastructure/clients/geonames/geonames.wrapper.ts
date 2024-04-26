import { Country } from '#shared/domain/entity/country.entity';
import { Province } from '#shared/domain/value-object/province.value-object';
import { FetchWrapper } from '#shared/infrastructure/clients/fetch-wrapper';

interface CountryInfoResponse {
  geonames: [
    {
      continent: string;
      capital: string;
      languages: string;
      geonameId: number;
      south: number;
      isoAlpha3: string;
      north: string;
      fipsCode: string;
      population: string;
      east: number;
      isoNumeric: string;
      areaInSqKm: string;
      countryCode: string;
      west: number;
      countryName: string;
      postalCodeFormat: string;
      continentName: string;
      currencyCode: string;
    },
  ];
}

interface ChildrenResponse {
  totalResultsCount: number;
  geonames: [
    {
      adminCode1: string;
      lng: string;
      geonameId: number;
      toponymName: string;
      countryId: string;
      fcl: string;
      population: number;
      countryCode: string;
      name: string;
      fclName: string;
      countryName: string;
      fcodeName: string;
      adminName1: string;
      lat: string;
      fcode: string;
    },
  ];
}

export class GeonamesWrapper {
  constructor(
    private wrapper: FetchWrapper,
    private readonly username: string,
  ) {}

  async getProvinces(country: Country): Promise<Province[]> {
    const countryIdGeonames: CountryInfoResponse = await this.wrapper.get(
      'countryInfoJSON',
      `country=${country.iso}&username=${this.username}`,
    );

    const statesGeonames: ChildrenResponse = await this.wrapper.get(
      'childrenJSON',
      `lang=es&geonameId=${countryIdGeonames.geonames[0].geonameId}&username=${this.username}`,
    );
    const states: Province[] = [];
    for (const stateJson of statesGeonames.geonames) {
      states.push(new Province(stateJson.adminName1));
    }
    //For Spain, we want to return the provinces, other cases we return the states
    if (country.iso === 'ES') {
      const spanishProvinces = [];
      for (const stateJson of statesGeonames.geonames) {
        const provincesJson: ChildrenResponse = await this.wrapper.get(
          'childrenJSON',
          `lang=es&geonameId=${stateJson.geonameId}&username=${this.username}`,
        );
        for (const provinceJson of provincesJson.geonames) {
          spanishProvinces.push(new Province(provinceJson.name));
        }
      }

      return spanishProvinces;
    }

    return states;
  }
}
