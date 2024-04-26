import { FileManager } from '#shared/domain/file-manager/file-manager';
import { CountryRepository } from '#shared/domain/repository/country.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { ProvinceGetter } from '#shared/domain/service/province-getter.service';
import { ConfigService } from '@nestjs/config';
import { GeonamesProvinceGetter } from '#shared/infrastructure/service/geonames-province-getter.service';
import { GeonamesWrapper } from '#shared/infrastructure/clients/geonames/geonames.wrapper';
import { FetchWrapper } from '#shared/infrastructure/clients/fetch-wrapper';

const countryGetter = {
  provide: CountryGetter,
  useFactory: (countryRepository: CountryRepository) => {
    return new CountryGetter(countryRepository);
  },
  inject: [CountryRepository],
};

const imageUploader = {
  provide: ImageUploader,
  useFactory: (uploader: FileManager) => {
    return new ImageUploader(uploader);
  },
  inject: [FileManager],
};

const provinceGetter = {
  provide: ProvinceGetter,
  useFactory: (configService: ConfigService): GeonamesProvinceGetter =>
    new GeonamesProvinceGetter(
      new GeonamesWrapper(
        new FetchWrapper(configService.getOrThrow('GEONAMES_URL')),
        configService.getOrThrow('GEONAMES_NAME'),
      ),
    ),
  inject: [ConfigService],
};

export const services = [countryGetter, imageUploader, provinceGetter];
