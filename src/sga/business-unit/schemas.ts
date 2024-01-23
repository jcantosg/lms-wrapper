import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';
import { classroomSchema } from '#business-unit/infrastructure/config/schema/classroom.schema';

export const businessUnitSchemas = [
  businessUnitSchema,
  virtualCampusSchema,
  examinationCenterSchema,
  classroomSchema,
];
