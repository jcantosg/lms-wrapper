import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { BusinessUnitPostgresRepository } from '#business-unit/infrastructure/repository/business-unit.postgres-repository';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { VirtualCampusPostgresRepository } from '#business-unit/infrastructure/repository/virtual-campus.postgres-repository';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { ExaminationCenterPostgresRepository } from '#business-unit/infrastructure/repository/examination-center.postgres-repository';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { ClassroomPostgresRepository } from '#business-unit/infrastructure/repository/classroom.postgres-repository';

export const repositories = [
  {
    provide: BusinessUnitRepository,
    useClass: BusinessUnitPostgresRepository,
  },
  {
    provide: VirtualCampusRepository,
    useClass: VirtualCampusPostgresRepository,
  },
  {
    provide: ExaminationCenterRepository,
    useClass: ExaminationCenterPostgresRepository,
  },
  {
    provide: ClassroomRepository,
    useClass: ClassroomPostgresRepository,
  },
];
