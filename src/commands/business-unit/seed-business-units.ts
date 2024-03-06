import datasource from '#config/ormconfig';
import { Country } from '#shared/domain/entity/country.entity';
import {
  businessUnits as businessUnitsRaw,
  examinationCenters as examinationCentersRaw,
} from '#commands/business-unit/business-units';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { v4 as uuid } from 'uuid';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { Logger } from '@nestjs/common';
import { Like, Repository } from 'typeorm';

async function getNextAvailableCode(
  codePart: string,
  repository: Repository<ExaminationCenter>,
): Promise<string> {
  const results = await repository.find({
    where: { code: Like(`${codePart}%`) },
  });

  const count = results.length;

  return `${codePart}${count > 9 ? '' + count : '0' + count}`;
}
export async function seedBusinessUnits(logger: Logger) {
  const countryRepository = datasource.getRepository(Country);
  const businessUnitRepository = datasource.getRepository(BusinessUnit);
  const virtualCampusRepository = datasource.getRepository(VirtualCampus);
  const examinationCenterRepository =
    datasource.getRepository(ExaminationCenter);
  const classroomRepository = datasource.getRepository(Classroom);
  const adminUserRepository = datasource.getRepository(AdminUser);

  const adminSga = await adminUserRepository.findOne({
    where: { email: 'sga@universae.com' },
  });

  for await (const businessUnitRaw of businessUnitsRaw) {
    const country = await countryRepository.findOne({
      where: { iso: businessUnitRaw.isoCountry },
    });

    const businessUnit = BusinessUnit.create(
      businessUnitRaw.id,
      businessUnitRaw.name,
      businessUnitRaw.code,
      country as Country,
      adminSga as AdminUser,
    );
    await businessUnitRepository.save(businessUnit);

    const virtualCampus = VirtualCampus.createFromBusinessUnit(
      uuid(),
      businessUnit,
      adminSga as AdminUser,
    );
    await virtualCampusRepository.save(virtualCampus);

    let code = businessUnit.name.substring(0, 3).toUpperCase();
    code = await getNextAvailableCode(code, examinationCenterRepository);

    const examinationCenter = ExaminationCenter.createFromBusinessUnit(
      uuid(),
      businessUnit,
      adminSga as AdminUser,
      code,
    );
    await examinationCenterRepository.save(examinationCenter);

    const classroom = Classroom.create(
      uuid(),
      examinationCenter.name + 'A01',
      'Aula1',
      5000,
      adminSga as AdminUser,
      examinationCenter,
    );
    await classroomRepository.save(classroom);
  }

  const examinationCenters: ExaminationCenter[] = [];
  for await (const examinationCenterRaw of examinationCentersRaw) {
    examinationCenters.push(
      ExaminationCenter.create(
        examinationCenterRaw.id,
        examinationCenterRaw.name,
        examinationCenterRaw.code,
        [],
        '',
        adminSga as AdminUser,
        (await countryRepository.findOne({
          where: { iso: examinationCenterRaw.isoCountry },
        })) as Country,
      ),
    );
  }

  await examinationCenterRepository.save(examinationCenters);

  logger.log('Business units, virtual campus and examination centers created');
}
