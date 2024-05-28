import { GetAllAcademicRecordModalitiesHandler } from '#student/application/academic-record/get-all-academic-record-modalities/get-all-academic-record-modalities.handler';
import { CreateAcademicRecordHandler } from '#student/application/academic-record/create-academic-record/create-academic-record.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { EditAcademicRecordHandler } from '#student/application/academic-record/edit-academic-record/edit-academic-record.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { GetAcademicRecordDetailHandler } from '#student/application/academic-record/get-academic-record-detail/get-academic-record-detail.handler';
import { GetStudentAcademicRecordHandler } from '#student/application/academic-record/get-student-academic-record/get-student-academic-record.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';

const createAcademicRecordHandler = {
  provide: CreateAcademicRecordHandler,
  useFactory: (
    repository: AcademicRecordRepository,
    administrativeGroupRepository: AdministrativeGroupRepository,
    businessUnitGetter: BusinessUnitGetter,
    virtualCampusGetter: VirtualCampusGetter,
    academicPeriodGetter: AcademicPeriodGetter,
    academicProgramGetter: AcademicProgramGetter,
    studentGetter: StudentGetter,
    eventDispatcher: EventDispatcher,
  ): CreateAcademicRecordHandler =>
    new CreateAcademicRecordHandler(
      repository,
      administrativeGroupRepository,
      businessUnitGetter,
      virtualCampusGetter,
      academicPeriodGetter,
      academicProgramGetter,
      studentGetter,
      eventDispatcher,
    ),
  inject: [
    AcademicRecordRepository,
    AdministrativeGroupRepository,
    BusinessUnitGetter,
    VirtualCampusGetter,
    AcademicPeriodGetter,
    AcademicProgramGetter,
    StudentGetter,
    EventDispatcher,
  ],
};

const editAcademicRecordHandler = {
  provide: EditAcademicRecordHandler,
  useFactory: (
    repository: AcademicRecordRepository,
    academicRecordGetter: AcademicRecordGetter,
  ): EditAcademicRecordHandler =>
    new EditAcademicRecordHandler(repository, academicRecordGetter),
  inject: [AcademicRecordRepository, AcademicRecordGetter],
};

const getAcademicRecordDetailHandler = {
  provide: GetAcademicRecordDetailHandler,
  useFactory: (
    academicRecordGetter: AcademicRecordGetter,
  ): GetAcademicRecordDetailHandler =>
    new GetAcademicRecordDetailHandler(academicRecordGetter),
  inject: [AcademicRecordGetter],
};

const getStudentAcademicRecordHandler = {
  provide: GetStudentAcademicRecordHandler,
  useFactory: (
    academicRecordGetter: AcademicRecordGetter,
    studentGetter: StudentGetter,
  ): GetStudentAcademicRecordHandler =>
    new GetStudentAcademicRecordHandler(academicRecordGetter, studentGetter),
  inject: [AcademicRecordGetter, StudentGetter],
};

export const academicRecordHandlers = [
  GetAllAcademicRecordModalitiesHandler,
  createAcademicRecordHandler,
  editAcademicRecordHandler,
  getAcademicRecordDetailHandler,
  getStudentAcademicRecordHandler,
];
