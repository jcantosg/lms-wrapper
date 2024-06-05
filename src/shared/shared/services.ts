import { FileManager } from '#shared/domain/file-manager/file-manager';
import { CountryRepository } from '#shared/domain/repository/country.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { ProvinceGetter } from '#shared/domain/service/province-getter.service';
import { ConfigService } from '@nestjs/config';
import { GeonamesProvinceGetter } from '#shared/infrastructure/service/geonames-province-getter.service';
import { GeonamesWrapper } from '#shared/infrastructure/clients/geonames/geonames.wrapper';
import { FetchWrapper } from '#shared/infrastructure/clients/fetch-wrapper';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { UUIDv4GeneratorService } from '#shared/infrastructure/service/uuid-v4.service';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { BCryptPasswordEncoder } from '#shared/infrastructure/service/bcrypt-password-encoder.service';
import { StudentPasswordChecker } from '#/student/student/domain/service/student-password-checker.service';
import { BcryptStudentPasswordChecker } from '#/student/student/infrastructure/service/bcrypt-student-password-checker.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { StudentRepository } from '#/student/student/domain/repository/student.repository';
import { ExcelFileParser } from '#shared/domain/service/excel-file-parser.service';
import { ExcelJSFileParser } from '#shared/infrastructure/service/exceljs-file-parser.service';
import { CRMImportRepository } from '#shared/domain/repository/crm-import.repository';

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

const uuidService = {
  provide: UUIDGeneratorService,
  useClass: UUIDv4GeneratorService,
};

const studentGetter = {
  provide: StudentGetter,
  useFactory: (repository: StudentRepository): StudentGetter =>
    new StudentGetter(repository),
  inject: [StudentRepository],
};

const passwordEncoder = {
  provide: PasswordEncoder,
  useClass: BCryptPasswordEncoder,
};

const passwordChecker = {
  provide: StudentPasswordChecker,
  useClass: BcryptStudentPasswordChecker,
};

const excelFileParser = {
  provide: ExcelFileParser,
  useFactory: (
    repository: CRMImportRepository,
    provincesGetter: ProvinceGetter,
    countryGetter: CountryGetter,
  ): ExcelJSFileParser =>
    new ExcelJSFileParser(repository, provincesGetter, countryGetter),
  inject: [CRMImportRepository, ProvinceGetter, CountryGetter],
};

export const services = [
  countryGetter,
  imageUploader,
  provinceGetter,
  uuidService,
  studentGetter,
  passwordEncoder,
  passwordChecker,
  excelFileParser,
];
