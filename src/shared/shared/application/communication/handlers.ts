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
  useFactory: (repository: CommunicationRepository): GetCommunicationsHandler =>
    new GetCommunicationsHandler(repository),
  inject: [CommunicationRepository],
};

const searchCommunicationsHandler = {
  provide: SearchCommunicationsHandler,
  useFactory: (
    repository: CommunicationRepository,
  ): SearchCommunicationsHandler => new SearchCommunicationsHandler(repository),
  inject: [CommunicationRepository],
};

export const communicationHandlers = [
  createCommunicationHandler,
  getCommunicationsHandler,
  searchCommunicationsHandler,
];
