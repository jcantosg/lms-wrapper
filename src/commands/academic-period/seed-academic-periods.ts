import { v4 as uuid } from 'uuid';
import datasource from '#config/ormconfig';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Logger } from '@nestjs/common';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import {
  academicPeriods as academicPeriodsRaw,
  periodBlocks as periodBlocksRaw,
} from '#commands/academic-period/academic-periods';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';

export async function seedAcademicPeriods(logger: Logger) {
  const academicPeriodRepository = datasource.getRepository(AcademicPeriod);
  const businessUnitRepository = datasource.getRepository(BusinessUnit);
  const adminUserRepository = datasource.getRepository(AdminUser);
  const periodBlockRepository = datasource.getRepository(PeriodBlock);

  const adminSga = await adminUserRepository.findOne({
    where: { email: 'sga@universae.com' },
  });

  const allBusinessUnits = await businessUnitRepository.find();

  const academicPeriods: AcademicPeriod[] = [];
  const periodBlocks: PeriodBlock[] = [];

  academicPeriodsRaw.forEach((academicPeriod) => {
    academicPeriods.push(
      AcademicPeriod.create(
        academicPeriod.id,
        academicPeriod.name,
        academicPeriod.code,
        academicPeriod.startDate as unknown as Date,
        academicPeriod.endDate as unknown as Date,
        allBusinessUnits.find(
          (bu) => bu.code === academicPeriod.businessUnit,
        ) as BusinessUnit,
        academicPeriod.blocksNumber,
        adminSga as AdminUser,
      ),
    );
  });

  academicPeriods.forEach((academicPeriod) => {
    periodBlocksRaw.forEach((raw) => {
      const block = PeriodBlock.create(
        uuid(),
        academicPeriod,
        raw.name,
        raw.startDate,
        raw.endDate,
        adminSga!,
      );
      periodBlocks.push(block);
      academicPeriod.periodBlocks.push(block);
    });
  });
  await academicPeriodRepository.save(academicPeriods);
  await periodBlockRepository.save(periodBlocks);
  logger.log('Academic periods created');
}
