import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { CreateExaminationCenterCommand } from '#business-unit/application/create-examination-center/create-examination-center.command';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterDuplicatedNameException } from '#shared/domain/exception/business-unit/examination-center-duplicated-name.exception';
import { ExaminationCenterDuplicatedCodeException } from '#shared/domain/exception/business-unit/examination-center-duplicated-code.exception';
import { ExaminationCenterDuplicatedException } from '#shared/domain/exception/business-unit/examination-center-duplicated.exception';
import { CountryGetter } from '#shared/domain/service/country-getter.service';

export class CreateExaminationCenterHandler implements CommandHandler {
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly adminUserGetter: AdminUserGetter,
    private readonly countryGetter: CountryGetter,
  ) {}

  async handle(command: CreateExaminationCenterCommand): Promise<void> {
    if (await this.examinationCenterRepository.existsByName(command.name)) {
      throw new ExaminationCenterDuplicatedNameException();
    }
    if (
      await this.examinationCenterRepository.existsByCode(
        command.id,
        command.code,
      )
    ) {
      throw new ExaminationCenterDuplicatedCodeException();
    }
    if (await this.examinationCenterRepository.existsById(command.id)) {
      throw new ExaminationCenterDuplicatedException();
    }
    const user = await this.adminUserGetter.get(command.userId);
    const businessUnits = await Promise.all(
      command.businessUnits.map(async (businessUnitId: string) => {
        return await this.businessUnitGetter.get(businessUnitId);
      }),
    );
    const country = await this.countryGetter.get(command.countryId);

    const examinationCenter = ExaminationCenter.create(
      command.id,
      command.name,
      command.code,
      businessUnits,
      command.address,
      user,
      country,
    );
    await this.examinationCenterRepository.save(examinationCenter);
  }
}
