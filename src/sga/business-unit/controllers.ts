import { CreateBusinessUnitController } from '#business-unit/infrastructure/controller/create-business-unit.controller';
import { EditBusinessUnitController } from '#business-unit/infrastructure/controller/edit-business-unit.controller';
import { GetAllBusinessController } from '#business-unit/infrastructure/controller/get-all-business-units/get-all-business-units.controller';
import { GetBusinessUnitController } from '#business-unit/infrastructure/controller/get-business-unit/get-business-unit.controller';
import { SearchBusinessUnitsController } from '#business-unit/infrastructure/controller/search-business-units.controller';
import { CreateVirtualCampusController } from '#business-unit/infrastructure/controller/create-virtual-campus.controller';
import { CreateExaminationCenterController } from '#business-unit/infrastructure/controller/create-examination-center.controller';
import { EditVirtualCampusController } from '#business-unit/infrastructure/controller/edit-virtual-campus.controller';
import { GetExaminationCenterController } from '#business-unit/infrastructure/controller/get-examination-center/get-examination-center.controller';
import { GetAllExaminationCentersController } from '#business-unit/infrastructure/controller/get-all-examination-centers/get-all-examination-centers.controller';
import { SearchExaminationCentersController } from '#business-unit/infrastructure/controller/search-examination-centers.controller';
import { DeleteExaminationCenterController } from '#business-unit/infrastructure/controller/delete-examination-center.controller';
import { EditExaminationCenterController } from '#business-unit/infrastructure/controller/edit-examination-center.controller';
import { GetBusinessUnitExaminationCentersController } from '#business-unit/infrastructure/controller/get-business-unit-examination-centers/get-business-unit-examination-centers.controller';
import { GetAllBusinessPlainController } from '#business-unit/infrastructure/controller/get-all-business-units-plain/get-all-business-units-plain.controller';
import { CreateClassroomController } from '#business-unit/infrastructure/controller/create-classroom.controller';

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
  GetExaminationCenterController,
  GetAllExaminationCentersController,
  DeleteExaminationCenterController,
  EditExaminationCenterController,
  GetBusinessUnitExaminationCentersController,
  CreateClassroomController,
];
