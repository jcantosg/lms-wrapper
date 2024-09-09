import { CreateCommunicationHandler } from '#shared/application/communication/create-communication/create-communication.handler';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { GetCommunicationsHandler } from '#shared/application/communication/get-communications/get-communications.handler';
import { SearchCommunicationsHandler } from '#shared/application/communication/search-communications/search-communications.handler';
import { GetCommunicationHandler } from '#shared/application/communication/get-communication/get-communication.handler';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { EditCommunicationHandler } from '#shared/application/communication/edit-communication/edit-communication.handler';
import { DeleteCommunicationHandler } from '#shared/application/communication/delete-communication/delete-communication.handler';
import { SendCommunicationHandler } from '#shared/application/communication/send-communication/send-communication.handler';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

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

const getCommunicationsHandler = {
  provide: GetCommunicationsHandler,
  useFactory: (
    repository: CommunicationRepository,
    studentGetter: StudentGetter,
  ): GetCommunicationsHandler =>
    new GetCommunicationsHandler(repository, studentGetter),
  inject: [CommunicationRepository, StudentGetter],
};

const searchCommunicationsHandler = {
  provide: SearchCommunicationsHandler,
  useFactory: (
    repository: CommunicationRepository,
    studentGetter: StudentGetter,
  ): SearchCommunicationsHandler =>
    new SearchCommunicationsHandler(repository, studentGetter),
  inject: [CommunicationRepository, StudentGetter],
};

const getCommunicationHandler = {
  provide: GetCommunicationHandler,
  useFactory: (
    repository: CommunicationRepository,
    studentGetter: StudentGetter,
  ): GetCommunicationHandler =>
    new GetCommunicationHandler(repository, studentGetter),
  inject: [CommunicationRepository, StudentGetter],
};

const editCommunicationHandler = {
  provide: EditCommunicationHandler,
  useFactory: (
    communicationRepository: CommunicationRepository,
    businessUnitGetter: BusinessUnitGetter,
    academicPeriodGetter: AcademicPeriodGetter,
    titleGetter: TitleGetter,
    academicProgramGetter: AcademicProgramGetter,
    internalGroupGetter: InternalGroupGetter,
    studentGetter: StudentGetter,
  ) =>
    new EditCommunicationHandler(
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

const deleteCommunicationHandler = {
  provide: DeleteCommunicationHandler,
  useFactory: (
    communicationRepository: CommunicationRepository,
    communicationStudentRepository: CommunicationStudentRepository,
  ) =>
    new DeleteCommunicationHandler(
      communicationRepository,
      communicationStudentRepository,
    ),
  inject: [CommunicationRepository, CommunicationStudentRepository],
};

const sendCommunicationHandler = {
  provide: SendCommunicationHandler,
  useFactory: (
    communicationRepository: CommunicationRepository,
    communicationStudentRepository: CommunicationStudentRepository,
    businessUnitGetter: BusinessUnitGetter,
    academicPeriodGetter: AcademicPeriodGetter,
    titleGetter: TitleGetter,
    academicProgramGetter: AcademicProgramGetter,
    internalGroupGetter: InternalGroupGetter,
    studentGetter: StudentGetter,
    uuidService: UUIDGeneratorService,
    mailer: MailerService,
    configService: ConfigService,
  ) =>
    new SendCommunicationHandler(
      communicationRepository,
      communicationStudentRepository,
      businessUnitGetter,
      academicPeriodGetter,
      titleGetter,
      academicProgramGetter,
      internalGroupGetter,
      studentGetter,
      uuidService,
      mailer,
      configService.getOrThrow('FROM_EMAIL_COMMUNICATIONS'),
    ),
  inject: [
    CommunicationRepository,
    CommunicationStudentRepository,
    BusinessUnitGetter,
    AcademicPeriodGetter,
    TitleGetter,
    AcademicProgramGetter,
    InternalGroupGetter,
    StudentGetter,
    UUIDGeneratorService,
    MailerService,
    ConfigService,
  ],
};

export const communicationHandlers = [
  createCommunicationHandler,
  getCommunicationsHandler,
  searchCommunicationsHandler,
  getCommunicationHandler,
  editCommunicationHandler,
  deleteCommunicationHandler,
  sendCommunicationHandler,
];
