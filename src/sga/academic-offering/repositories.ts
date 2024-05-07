import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriodPostgresRepository } from '#academic-offering/infrastructure/repository/academic-period.postgres-repository';
import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';
import { EvaluationTypePostgresRepository } from '#academic-offering/infrastructure/repository/evaluation-type.postgres-repository';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectPostgresRepository } from '#academic-offering/infrastructure/repository/subject.postgres-repository';
import { SubjectResourceRepository } from '#academic-offering/domain/repository/subject-resource.repository';
import { SubjectResourcePostgresRepository } from '#academic-offering/infrastructure/repository/subject-resource.postgres-repository';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { TitlePostgresRepository } from '#academic-offering/infrastructure/repository/title.postgres-repository';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { AcademicProgramPostgresRepository } from '#academic-offering/infrastructure/repository/academic-program.postgres-repository';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { ProgramBlockPostgresRepository } from '#academic-offering/infrastructure/repository/program-block.postgres-repository';
import { PeriodBlockRepository } from '#academic-offering/domain/repository/period-block.repository';
import { PeriodBlockPostgresRepository } from '#academic-offering/infrastructure/repository/period-block.postgres-repository';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import { BlockRelationPostgresRepository } from '#academic-offering/infrastructure/repository/block-relation.postgres-repository';

export const repositories = [
  {
    provide: AcademicPeriodRepository,
    useClass: AcademicPeriodPostgresRepository,
  },
  {
    provide: EvaluationTypeRepository,
    useClass: EvaluationTypePostgresRepository,
  },
  {
    provide: SubjectRepository,
    useClass: SubjectPostgresRepository,
  },
  {
    provide: SubjectResourceRepository,
    useClass: SubjectResourcePostgresRepository,
  },
  {
    provide: TitleRepository,
    useClass: TitlePostgresRepository,
  },
  {
    provide: AcademicProgramRepository,
    useClass: AcademicProgramPostgresRepository,
  },
  {
    provide: ProgramBlockRepository,
    useClass: ProgramBlockPostgresRepository,
  },
  {
    provide: PeriodBlockRepository,
    useClass: PeriodBlockPostgresRepository,
  },
  {
    provide: BlockRelationRepository,
    useClass: BlockRelationPostgresRepository,
  },
];
