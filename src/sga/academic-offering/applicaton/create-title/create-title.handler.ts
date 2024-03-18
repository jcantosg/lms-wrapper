import { CommandHandler } from '#shared/domain/bus/command.handler';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { CreateTitleCommand } from '#academic-offering/applicaton/create-title/create-title.command';
import { TitleDuplicatedException } from '#shared/domain/exception/academic-offering/title.duplicated.exception';
import { Title } from '#academic-offering/domain/entity/title.entity';

export class CreateTitleHandler implements CommandHandler {
  constructor(
    private readonly repository: TitleRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
  ) {}

  async handle(command: CreateTitleCommand): Promise<void> {
    if (await this.repository.exists(command.id)) {
      throw new TitleDuplicatedException();
    }

    const adminUserBusinessUnitsId = command.adminUser.businessUnits.map(
      (bu: BusinessUnit) => bu.id,
    );

    const businessUnit = await this.businessUnitGetter.getByAdminUser(
      command.businessUnitId,
      adminUserBusinessUnitsId,
    );

    const title = Title.create(
      command.id,
      command.name,
      command.officialCode,
      command.officialTitle,
      command.officialProgram,
      businessUnit,
      command.adminUser,
    );

    await this.repository.save(title);
  }
}
