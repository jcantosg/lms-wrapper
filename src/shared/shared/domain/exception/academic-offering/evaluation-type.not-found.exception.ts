import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class EvaluationTypeNotFoundException extends NotFoundException {
  constructor() {
    super('sga.evaluation-type.not-found');
  }
}
