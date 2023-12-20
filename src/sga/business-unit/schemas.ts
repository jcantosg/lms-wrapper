import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';

export const businessUnitSchemas = [
  businessUnitSchema,
  virtualCampusSchema,
  examinationCenterSchema,
];
