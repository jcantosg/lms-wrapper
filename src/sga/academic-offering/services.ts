import { EvaluationTypeGetter } from '#academic-offering/domain/service/evaluation-type-getter.service';
import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject-getter.service';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { EvaluationTypeBusinessUnitChecker } from '#academic-offering/domain/service/evaluation-type-business-unit-checker.service';
import { SubjectBusinessUnitChecker } from '#academic-offering/domain/service/subject-business-unit-checker.service';

const evaluationTypeGetter = {
  provide: EvaluationTypeGetter,
  useFactory: (repository: EvaluationTypeRepository): EvaluationTypeGetter =>
    new EvaluationTypeGetter(repository),
  inject: [EvaluationTypeRepository],
};

const subjectGetter = {
  provide: SubjectGetter,
  useFactory: (repository: SubjectRepository): SubjectGetter =>
    new SubjectGetter(repository),
  inject: [SubjectRepository],
};

export const services = [
  evaluationTypeGetter,
  subjectGetter,
  EvaluationTypeBusinessUnitChecker,
  SubjectBusinessUnitChecker,
];
