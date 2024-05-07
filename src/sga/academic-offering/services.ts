import { EvaluationTypeGetter } from '#academic-offering/domain/service/examination-type/evaluation-type-getter.service';
import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { EvaluationTypeBusinessUnitChecker } from '#academic-offering/domain/service/examination-type/evaluation-type-business-unit-checker.service';
import { SubjectBusinessUnitChecker } from '#academic-offering/domain/service/subject/subject-business-unit-checker.service';
import { SubjectResourceGetter } from '#academic-offering/domain/service/subject/subject-resource-getter.service';
import { SubjectResourceRepository } from '#academic-offering/domain/repository/subject-resource.repository';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { TransactionalService } from '#shared/domain/service/transactional-service.service';
import { CreateAcademicProgramTransactionService } from '#academic-offering/infrastructure/service/create-academic-program-transaction.service';
import datasource from '#config/ormconfig';

const evaluationTypeGetter = {
  provide: EvaluationTypeGetter,
  useFactory: (repository: EvaluationTypeRepository): EvaluationTypeGetter =>
    new EvaluationTypeGetter(repository),
  inject: [EvaluationTypeRepository],
};

const academicPeriodGetter = {
  provide: AcademicPeriodGetter,
  useFactory: (repository: AcademicPeriodRepository): AcademicPeriodGetter =>
    new AcademicPeriodGetter(repository),
  inject: [AcademicPeriodRepository],
};

const subjectGetter = {
  provide: SubjectGetter,
  useFactory: (repository: SubjectRepository): SubjectGetter =>
    new SubjectGetter(repository),
  inject: [SubjectRepository],
};

const subjectResourceGetter = {
  provide: SubjectResourceGetter,
  useFactory: (repository: SubjectResourceRepository): SubjectResourceGetter =>
    new SubjectResourceGetter(repository),
  inject: [SubjectResourceRepository],
};

const academicProgramGetter = {
  provide: AcademicProgramGetter,
  useFactory: (repository: AcademicProgramRepository): AcademicProgramGetter =>
    new AcademicProgramGetter(repository),
  inject: [AcademicProgramRepository],
};

const titleGetter = {
  provide: TitleGetter,
  useFactory: (repository: TitleRepository): TitleGetter =>
    new TitleGetter(repository),
  inject: [TitleRepository],
};

const programBlockGetter = {
  provide: ProgramBlockGetter,
  useFactory: (repository: ProgramBlockRepository): ProgramBlockGetter =>
    new ProgramBlockGetter(repository),
  inject: [ProgramBlockRepository],
};

const createAcademicProgramTransactionalService = {
  provide: TransactionalService,
  useFactory: (): CreateAcademicProgramTransactionService =>
    new CreateAcademicProgramTransactionService(datasource),
};

export const services = [
  evaluationTypeGetter,
  subjectGetter,
  EvaluationTypeBusinessUnitChecker,
  SubjectBusinessUnitChecker,
  academicPeriodGetter,
  subjectResourceGetter,
  academicProgramGetter,
  titleGetter,
  programBlockGetter,
  createAcademicProgramTransactionalService,
];
