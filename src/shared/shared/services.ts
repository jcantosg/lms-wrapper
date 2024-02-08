import { FileManager } from '#shared/domain/file-manager/file-manager';
import { CountryRepository } from '#shared/domain/repository/country.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';

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
export const services = [countryGetter, imageUploader];
