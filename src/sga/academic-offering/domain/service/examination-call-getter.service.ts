import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { ExaminationCallNotFoundException } from '#shared/domain/exception/academic-offering/examination-call.not-found.exception';

export class ExaminationCallGetter {
  constructor(
    private readonly examinationCallRepository: ExaminationCallRepository,
  ) {}

  async get(id: string): Promise<ExaminationCall> {
    const examinationCall = await this.examinationCallRepository.get(id);

    if (!examinationCall) {
      throw new ExaminationCallNotFoundException();
    }

    return examinationCall;
  }

  async getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<ExaminationCall> {
    const result = await this.examinationCallRepository.getByAdminUser(
      id,
      adminUserBusinessUnits,
      isSuperAdmin,
    );

    if (!result) {
      throw new ExaminationCallNotFoundException();
    }

    return result;
  }
}
