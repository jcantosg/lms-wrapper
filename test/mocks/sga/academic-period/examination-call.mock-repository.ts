import { ExaminationCallRepository } from '#/sga/academic-offering/domain/repository/examination-call.repository';

export class ExaminationCallMockRepository
  implements ExaminationCallRepository
{
  existsById = jest.fn();

  save = jest.fn();
}
