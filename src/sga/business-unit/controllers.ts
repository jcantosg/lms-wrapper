import { GetAllBusinessController } from '#business-unit/infrastructure/controller/business-unit/get-all-business-units/get-all-business-units.controller';
import { GetBusinessUnitController } from '#business-unit/infrastructure/controller/business-unit/get-business-unit/get-business-unit.controller';
import { GetExaminationCenterController } from '#business-unit/infrastructure/controller/examination-center/get-examination-center/get-examination-center.controller';
import { GetAllExaminationCentersController } from '#business-unit/infrastructure/controller/examination-center/get-all-examination-centers/get-all-examination-centers.controller';
import { GetBusinessUnitExaminationCentersController } from '#business-unit/infrastructure/controller/business-unit/get-business-unit-examination-centers/get-business-unit-examination-centers.controller';
import { GetAllPlainExaminationCentersController } from '#business-unit/infrastructure/controller/examination-center/get-all-plain-examination-centers/get-all-plain-examination-centers.controller';
import { GetAllBusinessPlainController } from '#business-unit/infrastructure/controller/business-unit/get-all-business-units-plain/get-all-business-units-plain.controller';
import { SearchBusinessUnitsController } from '#business-unit/infrastructure/controller/business-unit/search-business-units.controller';
import { CreateBusinessUnitController } from '#business-unit/infrastructure/controller/business-unit/create-business-unit.controller';
import { EditBusinessUnitController } from '#business-unit/infrastructure/controller/business-unit/edit-business-unit.controller';
import { CreateVirtualCampusController } from '#business-unit/infrastructure/controller/virtual-campus/create-virtual-campus.controller';
import { CreateExaminationCenterController } from '#business-unit/infrastructure/controller/examination-center/create-examination-center.controller';
import { EditVirtualCampusController } from '#business-unit/infrastructure/controller/virtual-campus/edit-virtual-campus.controller';
import { SearchExaminationCentersController } from '#business-unit/infrastructure/controller/examination-center/search-examination-centers.controller';
import { DeleteExaminationCenterController } from '#business-unit/infrastructure/controller/examination-center/delete-examination-center.controller';
import { EditExaminationCenterController } from '#business-unit/infrastructure/controller/examination-center/edit-examination-center.controller';
import { CreateClassroomController } from '#business-unit/infrastructure/controller/classroom/create-classroom.controller';
import { EditClassroomController } from '#business-unit/infrastructure/controller/classroom/edit-classroom.controller';
import { DeleteClassroomController } from '#business-unit/infrastructure/controller/classroom/delete-classroom.controller';
import { AddExaminationCentersToBusinessUnitController } from '#business-unit/infrastructure/controller/business-unit/add-examination-centers-to-business.unit.controller';
import { RemoveExaminationCenterFromBusinessUnitController } from '#business-unit/infrastructure/controller/business-unit/remove-examination-center-from-business.unit.controller';
import { AddBusinessUnitsToExaminationCenterController } from '#business-unit/infrastructure/controller/examination-center/add-business-units-to-examination-center.controller';
import { RemoveBusinessUnitFromExaminationCenterController } from '#business-unit/infrastructure/controller/examination-center/remove-business-unit-from-examination-center.controller';
import { GetVirtualCampusByBusinessUnitController } from '#business-unit/infrastructure/controller/virtual-campus/get-virtual-campus-by-business-unit/get-virtual-campus-by-business-unit.controller';

export const controllers = [
  SearchBusinessUnitsController,
  GetAllBusinessPlainController,
  CreateBusinessUnitController,
  EditBusinessUnitController,
  GetAllBusinessController,
  GetBusinessUnitController,
  CreateVirtualCampusController,
  CreateExaminationCenterController,
  EditVirtualCampusController,
  SearchExaminationCentersController,
  GetAllPlainExaminationCentersController,
  GetExaminationCenterController,
  GetAllExaminationCentersController,
  DeleteExaminationCenterController,
  EditExaminationCenterController,
  GetBusinessUnitExaminationCentersController,
  CreateClassroomController,
  EditClassroomController,
  DeleteClassroomController,
  AddExaminationCentersToBusinessUnitController,
  RemoveExaminationCenterFromBusinessUnitController,
  AddBusinessUnitsToExaminationCenterController,
  RemoveBusinessUnitFromExaminationCenterController,
  GetVirtualCampusByBusinessUnitController,
];
