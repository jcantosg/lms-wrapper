import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { CreateBusinessUnitHandler } from '#business-unit/application/create-business-unit/create-business-unit.handler';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { GetAllBusinessUnitsHandler } from '#business-unit/application/get-all-business-units/get-all-business-units.handler';
import { EditBusinessUnitHandler } from '#business-unit/application/edit-business-unit/edit-business-unit.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { GetBusinessUnitHandler } from '#business-unit/application/get-business-unit/get-business-unit.handler';
import { CreateVirtualCampusHandler } from '#business-unit/application/create-virtual-campus/create-virtual-campus.handler';
import { SearchBusinessUnitsHandler } from '#business-unit/application/search-business-units/search-business-units.handler';
import { CreateExaminationCenterHandler } from '#business-unit/application/create-examination-center/create-examination-center.handler';
import { EditVirtualCampusHandler } from './application/edit-virtual-campus/edit-virtual-campus.handler';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { GetExaminationCenterHandler } from '#business-unit/application/get-examination-center/get-examination-center.handler';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { GetAllExaminationCentersHandler } from '#business-unit/application/get-all-examination-centers/get-all-examination-centers.handler';
import { SearchExaminationCentersHandler } from '#business-unit/application/search-examination-centers/search-examination-centers.handler';
import { DeleteExaminationCenterHandler } from '#business-unit/application/delete-examination-center/delete-examination-center.handler';
import { EditExaminationCenterHandler } from '#business-unit/application/edit-examination-center/edit-examination-center.handler';
import { GetBusinessUnitExaminationCentersHandler } from '#business-unit/application/get-business-unit-examination-centers/get-business-unit-examination-centers.handler';
import { GetAllBusinessUnitsPlainHandler } from '#business-unit/application/get-all-business-units-plain/get-all-business-units-plain.handler';
import { ClassroomGetter } from '#business-unit/domain/service/classroom-getter.service';
import { CreateClassroomHandler } from '#business-unit/application/create-classroom/create-classroom.handler';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { EditClassroomHandler } from '#business-unit/application/edit-classroom/edit-classroom.handler';
import { DeleteClassroomHandler } from '#business-unit/application/delete-classroom/delete-classroom.handler';

const createBusinessUnitHandler = {
  provide: CreateBusinessUnitHandler,
  useFactory: (
    businessUnitRepository: BusinessUnitRepository,
    adminUserGetter: AdminUserGetter,
    countryGetter: CountryGetter,
    virtualCampusRepository: VirtualCampusRepository,
    examinationCenterRepository: ExaminationCenterRepository,
  ) => {
    return new CreateBusinessUnitHandler(
      businessUnitRepository,
      adminUserGetter,
      countryGetter,
      virtualCampusRepository,
      examinationCenterRepository,
    );
  },
  inject: [
    BusinessUnitRepository,
    AdminUserGetter,
    CountryGetter,
    VirtualCampusRepository,
    ExaminationCenterRepository,
  ],
};
const editBusinessUnitHandler = {
  provide: EditBusinessUnitHandler,
  useFactory: (
    businessUnitRepository: BusinessUnitRepository,
    businessGetter: BusinessUnitGetter,
    adminUserGetter: AdminUserGetter,
    countryGetter: CountryGetter,
  ) => {
    return new EditBusinessUnitHandler(
      businessUnitRepository,
      businessGetter,
      adminUserGetter,
      countryGetter,
    );
  },
  inject: [
    BusinessUnitRepository,
    BusinessUnitGetter,
    AdminUserGetter,
    CountryGetter,
  ],
};
const getBusinessUnitHandler = {
  provide: GetBusinessUnitHandler,
  useFactory: (businessUnitGetter: BusinessUnitGetter) => {
    return new GetBusinessUnitHandler(businessUnitGetter);
  },
  inject: [BusinessUnitGetter],
};

const getAllBusinessUnitsHandler = {
  provide: GetAllBusinessUnitsHandler,
  useFactory: (businessUnitRepository: BusinessUnitRepository) => {
    return new GetAllBusinessUnitsHandler(businessUnitRepository);
  },
  inject: [BusinessUnitRepository],
};

const searchBusinessUnitsHandler = {
  provide: SearchBusinessUnitsHandler,
  useFactory: (businessUnitRepository: BusinessUnitRepository) => {
    return new SearchBusinessUnitsHandler(businessUnitRepository);
  },
  inject: [BusinessUnitRepository],
};

const createVirtualCampusHandler = {
  provide: CreateVirtualCampusHandler,
  useFactory: (
    virtualCampusRepository: VirtualCampusRepository,
    businessUnitGetter: BusinessUnitGetter,
    adminUserGetter: AdminUserGetter,
  ) => {
    return new CreateVirtualCampusHandler(
      virtualCampusRepository,
      businessUnitGetter,
      adminUserGetter,
    );
  },
  inject: [VirtualCampusRepository, BusinessUnitGetter, AdminUserGetter],
};

const createExaminationServiceHandler = {
  provide: CreateExaminationCenterHandler,
  useFactory: (
    examinationCenterRepository: ExaminationCenterRepository,
    businessUnitGetter: BusinessUnitGetter,
    adminUserGetter: AdminUserGetter,
    countryGetter: CountryGetter,
  ) => {
    return new CreateExaminationCenterHandler(
      examinationCenterRepository,
      businessUnitGetter,
      adminUserGetter,
      countryGetter,
    );
  },
  inject: [
    ExaminationCenterRepository,
    BusinessUnitGetter,
    AdminUserGetter,
    CountryGetter,
  ],
};

const editVirtualCampusHandler = {
  provide: EditVirtualCampusHandler,
  useFactory: (
    virtualCampusRepository: VirtualCampusRepository,
    virtualCampusGetter: VirtualCampusGetter,
    adminUserGetter: AdminUserGetter,
  ) => {
    return new EditVirtualCampusHandler(
      virtualCampusRepository,
      virtualCampusGetter,
      adminUserGetter,
    );
  },
  inject: [
    VirtualCampusRepository,
    VirtualCampusGetter,
    AdminUserGetter,
    CountryGetter,
  ],
};

const getExaminationCenterHandler = {
  provide: GetExaminationCenterHandler,
  useFactory: (examinationCenterGetter: ExaminationCenterGetter) => {
    return new GetExaminationCenterHandler(examinationCenterGetter);
  },
  inject: [ExaminationCenterGetter],
};

const getAllExaminationCentersHandler = {
  provide: GetAllExaminationCentersHandler,
  useFactory: (examinationCenterRepository: ExaminationCenterRepository) => {
    return new GetAllExaminationCentersHandler(examinationCenterRepository);
  },
  inject: [ExaminationCenterRepository],
};

const searchExaminationCentersHandler = {
  provide: SearchExaminationCentersHandler,
  useFactory: (examinationCenterRepository: ExaminationCenterRepository) => {
    return new SearchExaminationCentersHandler(examinationCenterRepository);
  },
  inject: [ExaminationCenterRepository],
};

const deleteExaminationCenterHandler = {
  provide: DeleteExaminationCenterHandler,
  useFactory: (
    examinationCenterRepository: ExaminationCenterRepository,
    examinationCenterGetter: ExaminationCenterGetter,
  ) => {
    return new DeleteExaminationCenterHandler(
      examinationCenterRepository,
      examinationCenterGetter,
    );
  },
  inject: [ExaminationCenterRepository, ExaminationCenterGetter],
};

const editExaminationCenterHandler = {
  provide: EditExaminationCenterHandler,
  useFactory: (
    examinationCenterRepository: ExaminationCenterRepository,
    examinationCenterGetter: ExaminationCenterGetter,
    businessUnitGetter: BusinessUnitGetter,
    adminUserGetter: AdminUserGetter,
    classroomGetter: ClassroomGetter,
  ) => {
    return new EditExaminationCenterHandler(
      examinationCenterRepository,
      examinationCenterGetter,
      businessUnitGetter,
      adminUserGetter,
      classroomGetter,
    );
  },
  inject: [
    ExaminationCenterRepository,
    ExaminationCenterGetter,
    BusinessUnitGetter,
    AdminUserGetter,
    ClassroomGetter,
  ],
};

const getBusinessUnitExaminationCentersHandler = {
  provide: GetBusinessUnitExaminationCentersHandler,
  useFactory: (examinationCenterRepository: ExaminationCenterRepository) => {
    return new GetBusinessUnitExaminationCentersHandler(
      examinationCenterRepository,
    );
  },
  inject: [ExaminationCenterRepository],
};

const getAllBusinessUnitsPlainHandler = {
  provide: GetAllBusinessUnitsPlainHandler,
  useFactory: (businessUnitRepository: BusinessUnitRepository) => {
    return new GetAllBusinessUnitsPlainHandler(businessUnitRepository);
  },
  inject: [BusinessUnitRepository, AdminUserGetter],
};

const createClassRoomHandler = {
  provide: CreateClassroomHandler,
  useFactory: (
    classroomRepository: ClassroomRepository,
    examinationCenterGetter: ExaminationCenterGetter,
    adminUserGetter: AdminUserGetter,
  ) => {
    return new CreateClassroomHandler(
      classroomRepository,
      examinationCenterGetter,
      adminUserGetter,
    );
  },
  inject: [ClassroomRepository, ExaminationCenterGetter, AdminUserGetter],
};

const editClassroomHandler = {
  provide: EditClassroomHandler,
  useFactory: (
    classroomRepository: ClassroomRepository,
    classroomGetter: ClassroomGetter,
    adminUserGetter: AdminUserGetter,
  ) => {
    return new EditClassroomHandler(
      classroomRepository,
      classroomGetter,
      adminUserGetter,
    );
  },
  inject: [ClassroomRepository, ClassroomGetter, AdminUserGetter],
};

const deleteClassroomHandler = {
  provide: DeleteClassroomHandler,
  useFactory: (
    classroomRepository: ClassroomRepository,
    classroomGetter: ClassroomGetter,
  ) => {
    return new DeleteClassroomHandler(classroomRepository, classroomGetter);
  },
  inject: [ClassroomRepository, ClassroomGetter],
};

export const handlers = [
  createBusinessUnitHandler,
  editBusinessUnitHandler,
  getAllBusinessUnitsHandler,
  createBusinessUnitHandler,
  editBusinessUnitHandler,
  getBusinessUnitHandler,
  createVirtualCampusHandler,
  searchBusinessUnitsHandler,
  createExaminationServiceHandler,
  editVirtualCampusHandler,
  getExaminationCenterHandler,
  getAllExaminationCentersHandler,
  searchExaminationCentersHandler,
  deleteExaminationCenterHandler,
  editExaminationCenterHandler,
  getBusinessUnitExaminationCentersHandler,
  editClassroomHandler,
  getAllBusinessUnitsPlainHandler,
  createClassRoomHandler,
  deleteClassroomHandler,
];
