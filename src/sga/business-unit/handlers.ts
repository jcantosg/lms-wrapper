import { CreateBusinessUnitHandler } from '#business-unit/application/business-unit/create-business-unit/create-business-unit.handler';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { GetAllBusinessUnitsHandler } from '#business-unit/application/business-unit/get-all-business-units/get-all-business-units.handler';
import { EditBusinessUnitHandler } from '#business-unit/application/business-unit/edit-business-unit/edit-business-unit.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { GetBusinessUnitHandler } from '#business-unit/application/business-unit/get-business-unit/get-business-unit.handler';
import { CreateVirtualCampusHandler } from '#business-unit/application/virtual-campus/create-virtual-campus/create-virtual-campus.handler';
import { SearchBusinessUnitsHandler } from '#business-unit/application/business-unit/search-business-units/search-business-units.handler';
import { CreateExaminationCenterHandler } from '#business-unit/application/examination-center/create-examination-center/create-examination-center.handler';
import { EditVirtualCampusHandler } from './application/virtual-campus/edit-virtual-campus/edit-virtual-campus.handler';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { GetExaminationCenterHandler } from '#business-unit/application/examination-center/get-examination-center/get-examination-center.handler';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { GetAllExaminationCentersHandler } from '#business-unit/application/examination-center/get-all-examination-centers/get-all-examination-centers.handler';
import { SearchExaminationCentersHandler } from '#business-unit/application/examination-center/search-examination-centers/search-examination-centers.handler';
import { DeleteExaminationCenterHandler } from '#business-unit/application/examination-center/delete-examination-center/delete-examination-center.handler';
import { EditExaminationCenterHandler } from '#business-unit/application/examination-center/edit-examination-center/edit-examination-center.handler';
import { GetBusinessUnitExaminationCentersHandler } from '#business-unit/application/business-unit/get-business-unit-examination-centers/get-business-unit-examination-centers.handler';
import { GetAllPlainExaminationCentersHandler } from '#business-unit/application/examination-center/get-all-plain-examination-centers/get-all-plain-examination-centers.handler';
import { GetAllBusinessUnitsPlainHandler } from '#business-unit/application/business-unit/get-all-business-units-plain/get-all-business-units-plain.handler';
import { ClassroomGetter } from '#business-unit/domain/service/classroom-getter.service';
import { CreateClassroomHandler } from '#business-unit/application/classroom/create-classroom/create-classroom.handler';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { EditClassroomHandler } from '#business-unit/application/classroom/edit-classroom/edit-classroom.handler';
import { DeleteClassroomHandler } from '#business-unit/application/classroom/delete-classroom/delete-classroom.handler';
import { AddExaminationCentersToBusinessUnitHandler } from '#business-unit/application/business-unit/add-examination-centers-to-business-unit/add-examination-centers-to-business-unit.handler';
import { RemoveExaminationCentersFromBusinessUnitHandler } from '#business-unit/application/business-unit/remove-examination-center-from-business-unit/remove-examination-center-from-business-unit.handler';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { AddBusinessUnitsToExaminationCenterHandler } from '#business-unit/application/examination-center/add-business-units-to-examination-center/add-business-units-to-examination-center.handler';
import { RemoveBusinessUnitFromExaminationCenterHandler } from '#business-unit/application/examination-center/remove-business-unit-from-examination-center/remove-business-unit-from-examination-center.handler';
import { GetVirtualCampusByBusinessUnitHandler } from '#business-unit/application/virtual-campus/get-virtual-campus-by-business-unit/get-virtual-campus-by-business-unit.handler';

const createBusinessUnitHandler = {
  provide: CreateBusinessUnitHandler,
  useFactory: (
    businessUnitRepository: BusinessUnitRepository,
    countryGetter: CountryGetter,
    virtualCampusRepository: VirtualCampusRepository,
    examinationCenterRepository: ExaminationCenterRepository,
    eventDispatcher: EventDispatcher,
  ) => {
    return new CreateBusinessUnitHandler(
      businessUnitRepository,
      countryGetter,
      virtualCampusRepository,
      examinationCenterRepository,
      eventDispatcher,
    );
  },
  inject: [
    BusinessUnitRepository,
    CountryGetter,
    VirtualCampusRepository,
    ExaminationCenterRepository,
    EventDispatcher,
  ],
};
const editBusinessUnitHandler = {
  provide: EditBusinessUnitHandler,
  useFactory: (
    businessUnitRepository: BusinessUnitRepository,
    virtualCampusRepository: VirtualCampusRepository,
    businessGetter: BusinessUnitGetter,
    countryGetter: CountryGetter,
  ) => {
    return new EditBusinessUnitHandler(
      businessUnitRepository,
      virtualCampusRepository,
      businessGetter,
      countryGetter,
    );
  },
  inject: [
    BusinessUnitRepository,
    VirtualCampusRepository,
    BusinessUnitGetter,
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
  ) => {
    return new CreateVirtualCampusHandler(
      virtualCampusRepository,
      businessUnitGetter,
    );
  },
  inject: [VirtualCampusRepository, BusinessUnitGetter],
};

const createExaminationServiceHandler = {
  provide: CreateExaminationCenterHandler,
  useFactory: (
    examinationCenterRepository: ExaminationCenterRepository,
    businessUnitGetter: BusinessUnitGetter,
    countryGetter: CountryGetter,
  ) => {
    return new CreateExaminationCenterHandler(
      examinationCenterRepository,
      businessUnitGetter,
      countryGetter,
    );
  },
  inject: [ExaminationCenterRepository, BusinessUnitGetter, CountryGetter],
};

const editVirtualCampusHandler = {
  provide: EditVirtualCampusHandler,
  useFactory: (
    virtualCampusRepository: VirtualCampusRepository,
    virtualCampusGetter: VirtualCampusGetter,
  ) => {
    return new EditVirtualCampusHandler(
      virtualCampusRepository,
      virtualCampusGetter,
    );
  },
  inject: [VirtualCampusRepository, VirtualCampusGetter, CountryGetter],
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
    countryGetter: CountryGetter,
  ) => {
    return new EditExaminationCenterHandler(
      examinationCenterRepository,
      examinationCenterGetter,
      countryGetter,
    );
  },
  inject: [ExaminationCenterRepository, ExaminationCenterGetter, CountryGetter],
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

const getAllPlainExaminationCentersHandler = {
  provide: GetAllPlainExaminationCentersHandler,
  useFactory: (examinationCenterRepository: ExaminationCenterRepository) => {
    return new GetAllPlainExaminationCentersHandler(
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
  inject: [BusinessUnitRepository],
};

const createClassRoomHandler = {
  provide: CreateClassroomHandler,
  useFactory: (
    classroomRepository: ClassroomRepository,
    examinationCenterGetter: ExaminationCenterGetter,
  ) => {
    return new CreateClassroomHandler(
      classroomRepository,
      examinationCenterGetter,
    );
  },
  inject: [ClassroomRepository, ExaminationCenterGetter],
};

const editClassroomHandler = {
  provide: EditClassroomHandler,
  useFactory: (
    classroomRepository: ClassroomRepository,
    classroomGetter: ClassroomGetter,
  ) => {
    return new EditClassroomHandler(classroomRepository, classroomGetter);
  },
  inject: [ClassroomRepository, ClassroomGetter],
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

const addExaminationCentersToBusinessUnitHandler = {
  provide: AddExaminationCentersToBusinessUnitHandler,
  useFactory: (
    businessUnitRepository: BusinessUnitRepository,
    businessUnitGetter: BusinessUnitGetter,
    examinationCenterGetter: ExaminationCenterGetter,
  ) => {
    return new AddExaminationCentersToBusinessUnitHandler(
      businessUnitRepository,
      businessUnitGetter,
      examinationCenterGetter,
    );
  },
  inject: [BusinessUnitRepository, BusinessUnitGetter, ExaminationCenterGetter],
};

const removeExaminationCentersFromBusinessUnitHandler = {
  provide: RemoveExaminationCentersFromBusinessUnitHandler,
  useFactory: (
    businessUnitRepository: BusinessUnitRepository,
    businessUnitGetter: BusinessUnitGetter,
    examinationCenterGetter: ExaminationCenterGetter,
  ) => {
    return new RemoveExaminationCentersFromBusinessUnitHandler(
      businessUnitRepository,
      businessUnitGetter,
      examinationCenterGetter,
    );
  },
  inject: [BusinessUnitRepository, BusinessUnitGetter, ExaminationCenterGetter],
};

const addBusinessUnitsToExaminationCenterHandler = {
  provide: AddBusinessUnitsToExaminationCenterHandler,
  useFactory: (
    examinationCenterRepository: ExaminationCenterRepository,
    businessUnitGetter: BusinessUnitGetter,
    examinationCenterGetter: ExaminationCenterGetter,
  ) => {
    return new AddBusinessUnitsToExaminationCenterHandler(
      examinationCenterRepository,
      businessUnitGetter,
      examinationCenterGetter,
    );
  },
  inject: [
    ExaminationCenterRepository,
    BusinessUnitGetter,
    ExaminationCenterGetter,
  ],
};

const removeBusinessUnitFromExaminationCenterHandler = {
  provide: RemoveBusinessUnitFromExaminationCenterHandler,
  useFactory: (
    examinationCenterRepository: ExaminationCenterRepository,
    businessUnitGetter: BusinessUnitGetter,
    examinationCenterGetter: ExaminationCenterGetter,
  ) => {
    return new RemoveBusinessUnitFromExaminationCenterHandler(
      examinationCenterRepository,
      businessUnitGetter,
      examinationCenterGetter,
    );
  },
  inject: [
    ExaminationCenterRepository,
    BusinessUnitGetter,
    ExaminationCenterGetter,
  ],
};

const getVirtualCampusByBusinessUnitHandler = {
  provide: GetVirtualCampusByBusinessUnitHandler,
  useFactory: (repository: VirtualCampusRepository) => {
    return new GetVirtualCampusByBusinessUnitHandler(repository);
  },
  inject: [VirtualCampusRepository],
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
  getAllPlainExaminationCentersHandler,
  editClassroomHandler,
  getAllBusinessUnitsPlainHandler,
  createClassRoomHandler,
  deleteClassroomHandler,
  addExaminationCentersToBusinessUnitHandler,
  removeExaminationCentersFromBusinessUnitHandler,
  addBusinessUnitsToExaminationCenterHandler,
  removeBusinessUnitFromExaminationCenterHandler,
  getVirtualCampusByBusinessUnitHandler,
];
