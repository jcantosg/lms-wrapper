import { EvaluationTypeGetter } from '#academic-offering/domain/service/evaluation-type-getter.service';
import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period-getter.service';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject-getter.service';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { EvaluationTypeBusinessUnitChecker } from '#academic-offering/domain/service/evaluation-type-business-unit-checker.service';
import { SubjectBusinessUnitChecker } from '#academic-offering/domain/service/subject-business-unit-checker.service';
import { ExaminationCallGetter } from '#academic-offering/domain/service/examination-call-getter.service';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program-getter.service';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { TitleGetter } from '#academic-offering/domain/service/title-getter.service';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';

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

const examinationCallGetter = {
  provide: ExaminationCallGetter,
  useFactory: (repository: ExaminationCallRepository): ExaminationCallGetter =>
    new ExaminationCallGetter(repository),
  inject: [ExaminationCallRepository],
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

export const services = [
  evaluationTypeGetter,
  subjectGetter,
  EvaluationTypeBusinessUnitChecker,
  SubjectBusinessUnitChecker,
  academicPeriodGetter,
  examinationCallGetter,
  academicProgramGetter,
  titleGetter,
];
