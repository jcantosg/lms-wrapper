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
import { StudentPasswordChecker } from '#/student-360/student/domain/service/student-password-checker.service';
import { BcryptStudentPasswordChecker } from '#/student-360/student/infrastructure/service/bcrypt-student-password-checker.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { Logger } from '@nestjs/common';
import { ExcelFileParser } from '#shared/domain/service/excel-file-parser.service';
import { ExcelJSFileParser } from '#shared/infrastructure/service/exceljs-file-parser.service';
import { CRMImportRepository } from '#shared/domain/repository/crm-import.repository';
import { ChatroomsByInternalGroupCreator } from '#shared/domain/service/chatrooms-by-internal-group-creator.service';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { StudentSubjectsToChatGetter } from '#shared/domain/service/student-subjects-to-chat-getter.service';
import { ExcelJSFileParserBatch } from '#shared/infrastructure/service/exceljs-file-parser-batch.service';
import { ExcelFileParserBatch } from '#shared/domain/service/excel-file-parser-batch.service';
import { CityGetter } from '#shared/domain/service/city-getter.service';
import { GeonamesCityGetter } from '#shared/infrastructure/service/geonames-city-getter.service';

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
  useFactory: (
    configService: ConfigService,
    logger: Logger,
  ): GeonamesProvinceGetter =>
    new GeonamesProvinceGetter(
      new GeonamesWrapper(
        new FetchWrapper(configService.getOrThrow('GEONAMES_URL'), logger),
        configService.getOrThrow('GEONAMES_NAME'),
      ),
    ),
  inject: [ConfigService],
};

const cityGetter = {
  provide: CityGetter,
  useFactory: (configService: ConfigService): GeonamesCityGetter =>
    new GeonamesCityGetter(
      new GeonamesWrapper(
        new FetchWrapper(
          configService.getOrThrow('GEONAMES_URL'),
          new Logger(),
        ),
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
    countryGetter: CountryGetter,
  ): ExcelJSFileParser => new ExcelJSFileParser(repository, countryGetter),
  inject: [CRMImportRepository, CountryGetter],
};

const excelFileParserBatch = {
  provide: ExcelFileParserBatch,
  useFactory: (
    repository: CRMImportRepository,
    countryGetter: CountryGetter,
  ): ExcelJSFileParserBatch =>
    new ExcelJSFileParserBatch(repository, countryGetter),
  inject: [CRMImportRepository, CountryGetter],
};

const chatroomsByInternalGroupCreator = {
  provide: ChatroomsByInternalGroupCreator,
  useFactory: (
    internalGroupRepository: InternalGroupRepository,
    chatroomRepository: ChatroomRepository,
    uuidGenerator: UUIDGeneratorService,
  ) => {
    return new ChatroomsByInternalGroupCreator(
      internalGroupRepository,
      chatroomRepository,
      uuidGenerator,
    );
  },
  inject: [InternalGroupRepository, ChatroomRepository, UUIDGeneratorService],
};

export const services = [
  countryGetter,
  imageUploader,
  provinceGetter,
  cityGetter,
  uuidService,
  studentGetter,
  passwordEncoder,
  passwordChecker,
  excelFileParser,
  excelFileParserBatch,
  chatroomsByInternalGroupCreator,
  StudentSubjectsToChatGetter,
];
