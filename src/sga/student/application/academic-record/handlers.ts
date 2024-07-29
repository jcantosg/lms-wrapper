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
import { GetAllAcademicRecordStatusHandler } from '#student/application/academic-record/get-all-academic-record-status/get-all-academic-record-status.handler';
import { TransferAcademicRecordHandler } from '#student/application/academic-record/transfer-academic-record/transfer-academic-record.handler';
import { TransferAcademicRecordTransactionalService } from '#student/domain/service/transfer-academic-record.transactional-service';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { EnrollmentCreator } from '#student/domain/service/enrollment-creator.service';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { UpdateInternalGroupsService } from '#student/domain/service/update-internal-groups.service';
import { UpdateAdministrativeGroupsService } from '#student/domain/service/update-administrative-groups.service';
import { CreateAdministrativeProcessHandler } from '#student/application/administrative-process/create-administrative-process/create-administrative-process.handler';
import { StudentAdministrativeGroupByAcademicRecordGetter } from '#student/domain/service/student-administrative-group-by-academic-record.getter.service';

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
    uuidService: UUIDGeneratorService,
    createAdministrativeProcessHandler: CreateAdministrativeProcessHandler,
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
      uuidService,
      createAdministrativeProcessHandler,
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
    UUIDGeneratorService,
    CreateAdministrativeProcessHandler,
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
    studentAdministrativeGroupByAcademicRecordGetter: StudentAdministrativeGroupByAcademicRecordGetter,
  ): GetAcademicRecordDetailHandler =>
    new GetAcademicRecordDetailHandler(
      academicRecordGetter,
      studentAdministrativeGroupByAcademicRecordGetter,
    ),
  inject: [
    AcademicRecordGetter,
    StudentAdministrativeGroupByAcademicRecordGetter,
  ],
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
const transferAcademicRecordHandler = {
  provide: TransferAcademicRecordHandler,
  useFactory: (
    businessUnitGetter: BusinessUnitGetter,
    virtualCampusGetter: VirtualCampusGetter,
    academicPeriodGetter: AcademicPeriodGetter,
    academicProgramGetter: AcademicProgramGetter,
    transactionalService: TransferAcademicRecordTransactionalService,
    academicRecordGetter: AcademicRecordGetter,
    fileManager: FileManager,
    enrollmentCreatorService: EnrollmentCreator,
    enrollmentGetter: EnrollmentGetter,
    uuidService: UUIDGeneratorService,
    updateInternalGroupsService: UpdateInternalGroupsService,
    updateAdministrativeGroupsService: UpdateAdministrativeGroupsService,
    eventDispatcher: EventDispatcher,
    createAdministrativeProcessHandler: CreateAdministrativeProcessHandler,
  ): TransferAcademicRecordHandler =>
    new TransferAcademicRecordHandler(
      businessUnitGetter,
      virtualCampusGetter,
      academicPeriodGetter,
      academicProgramGetter,
      transactionalService,
      academicRecordGetter,
      fileManager,
      enrollmentCreatorService,
      enrollmentGetter,
      uuidService,
      updateInternalGroupsService,
      updateAdministrativeGroupsService,
      eventDispatcher,
      createAdministrativeProcessHandler,
    ),
  inject: [
    BusinessUnitGetter,
    VirtualCampusGetter,
    AcademicPeriodGetter,
    AcademicProgramGetter,
    TransferAcademicRecordTransactionalService,
    AcademicRecordGetter,
    FileManager,
    EnrollmentCreator,
    EnrollmentGetter,
    UUIDGeneratorService,
    UpdateInternalGroupsService,
    UpdateAdministrativeGroupsService,
    EventDispatcher,
    CreateAdministrativeProcessHandler,
  ],
};

export const academicRecordHandlers = [
  GetAllAcademicRecordModalitiesHandler,
  createAcademicRecordHandler,
  editAcademicRecordHandler,
  getAcademicRecordDetailHandler,
  getStudentAcademicRecordHandler,
  GetAllAcademicRecordStatusHandler,
  transferAcademicRecordHandler,
];
