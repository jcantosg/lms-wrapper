import { CreateAdministrativeGroupHandler } from '#student/application/administrative-group/create-administrative-group/create-administrative-group.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { GetAllAdministrativeGroupsHandler } from '#student/application/administrative-group/get-all-administrative-groups/get-all-administrative-groups.handler';
import { SearchAdministrativeGroupsHandler } from '#student/application/administrative-group/search-administrative-groups/search-administrative-groups.handler';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { GetAdministrativeGroupHandler } from '#student/application/administrative-group/get-administrative-group/get-administrative-group.handler';
import { AddEdaeUserToAdministrativeGroupHandler } from '#student/application/administrative-group/add-teacher-to-administrative-group/add-edae-user-to-administrative-group.handler';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { RemoveEdaeUserFromAdministrativeGroupHandler } from '#student/application/administrative-group/remove-edae-user-from-administrative-group/remove-edae-user-from-administrative-group.handler';
import { GetAdministrativeGroupByAcademicProgramHandler } from '#student/application/administrative-group/get-administrative-group-by-academic-program/get-administrative-group-by-academic-program.handler';
import { MoveStudentFromAdministrativeGroupHandler } from '#student/application/administrative-group/move-student-from-administrative-group/move-student-from-administrative-group.handler';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { MoveStudentFromAdministrativeGroupTransactionalService } from '#student/domain/service/move-student-from-administrative-group.transactional.service';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { UpdateInternalGroupsService } from '#student/domain/service/update-internal-groups.service';

const createAdministrativeGroupHandler = {
  provide: CreateAdministrativeGroupHandler,
  useFactory: (
    repository: AdministrativeGroupRepository,
    blockRelationRepository: BlockRelationRepository,
    businessUnitGetter: BusinessUnitGetter,
    academicPeriodGetter: AcademicPeriodGetter,
    academicProgramGetter: AcademicProgramGetter,
    uuidService: UUIDGeneratorService,
  ): CreateAdministrativeGroupHandler =>
    new CreateAdministrativeGroupHandler(
      repository,
      blockRelationRepository,
      businessUnitGetter,
      academicPeriodGetter,
      academicProgramGetter,
      uuidService,
    ),
  inject: [
    AdministrativeGroupRepository,
    BlockRelationRepository,
    BusinessUnitGetter,
    AcademicPeriodGetter,
    AcademicProgramGetter,
    UUIDGeneratorService,
  ],
};

const getAllAdministrativeGroupsHandler = {
  provide: GetAllAdministrativeGroupsHandler,
  useFactory: (
    repository: AdministrativeGroupRepository,
  ): GetAllAdministrativeGroupsHandler =>
    new GetAllAdministrativeGroupsHandler(repository),
  inject: [AdministrativeGroupRepository],
};

const searchAdministrativeGroupsHandler = {
  provide: SearchAdministrativeGroupsHandler,
  useFactory: (
    repository: AdministrativeGroupRepository,
  ): SearchAdministrativeGroupsHandler =>
    new SearchAdministrativeGroupsHandler(repository),
  inject: [AdministrativeGroupRepository],
};

const getAdministrativeGroupHandler = {
  provide: GetAdministrativeGroupHandler,
  useFactory: (
    administrativeGroupGetter: AdministrativeGroupGetter,
  ): GetAdministrativeGroupHandler =>
    new GetAdministrativeGroupHandler(administrativeGroupGetter),
  inject: [AdministrativeGroupGetter],
};

const addEdaeUserToAdministrativeGroupHandler = {
  provide: AddEdaeUserToAdministrativeGroupHandler,
  useFactory: (
    repository: AdministrativeGroupRepository,
    administrativeGroupGetter: AdministrativeGroupGetter,
    edaeUserGetter: EdaeUserGetter,
  ): AddEdaeUserToAdministrativeGroupHandler =>
    new AddEdaeUserToAdministrativeGroupHandler(
      repository,
      administrativeGroupGetter,
      edaeUserGetter,
    ),
  inject: [
    AdministrativeGroupRepository,
    AdministrativeGroupGetter,
    EdaeUserGetter,
  ],
};

const removeEdaeUserFromAdministrativeGroupHandler = {
  provide: RemoveEdaeUserFromAdministrativeGroupHandler,
  useFactory: (
    repository: AdministrativeGroupRepository,
    administrativeGroupGetter: AdministrativeGroupGetter,
    edaeUserGetter: EdaeUserGetter,
  ): RemoveEdaeUserFromAdministrativeGroupHandler =>
    new RemoveEdaeUserFromAdministrativeGroupHandler(
      repository,
      administrativeGroupGetter,
      edaeUserGetter,
    ),
  inject: [
    AdministrativeGroupRepository,
    AdministrativeGroupGetter,
    EdaeUserGetter,
  ],
};

const getAdministrativeGroupByAcademicProgramHandler = {
  provide: GetAdministrativeGroupByAcademicProgramHandler,
  useFactory: (
    administrativeGroupRepository: AdministrativeGroupRepository,
  ): GetAdministrativeGroupByAcademicProgramHandler =>
    new GetAdministrativeGroupByAcademicProgramHandler(
      administrativeGroupRepository,
    ),
  inject: [AdministrativeGroupRepository],
};

const moveStudentFromAdministrativeGroupHandler = {
  provide: MoveStudentFromAdministrativeGroupHandler,
  useFactory: (
    studentRepository: StudentRepository,
    administrativeGroupGetter: AdministrativeGroupGetter,
    transactionalService: MoveStudentFromAdministrativeGroupTransactionalService,
    academicRecordRepository: AcademicRecordRepository,
    enrollmentGetter: EnrollmentGetter,
    updateInternalGroupsService: UpdateInternalGroupsService,
  ): MoveStudentFromAdministrativeGroupHandler =>
    new MoveStudentFromAdministrativeGroupHandler(
      studentRepository,
      administrativeGroupGetter,
      transactionalService,
      academicRecordRepository,
      enrollmentGetter,
      updateInternalGroupsService,
    ),
  inject: [
    StudentRepository,
    AdministrativeGroupGetter,
    MoveStudentFromAdministrativeGroupTransactionalService,
    AcademicRecordRepository,
    EnrollmentGetter,
    UpdateInternalGroupsService,
  ],
};

export const administrativeGroupHandlers = [
  createAdministrativeGroupHandler,
  getAllAdministrativeGroupsHandler,
  searchAdministrativeGroupsHandler,
  getAdministrativeGroupHandler,
  addEdaeUserToAdministrativeGroupHandler,
  removeEdaeUserFromAdministrativeGroupHandler,
  getAdministrativeGroupByAcademicProgramHandler,
  moveStudentFromAdministrativeGroupHandler,
];
