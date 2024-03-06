import datasource from '#config/ormconfig';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Logger } from '@nestjs/common';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { academicPeriods as academicPeriodsRaw } from '#commands/academic-period/academic-periods';

export async function seedAcademicPeriods(logger: Logger) {
  const academicPeriodRepository = datasource.getRepository(AcademicPeriod);
  const businessUnitRepository = datasource.getRepository(BusinessUnit);
  const adminUserRepository = datasource.getRepository(AdminUser);

  const adminSga = await adminUserRepository.findOne({
    where: { email: 'sga@universae.com' },
  });

  const allBusinessUnits = await businessUnitRepository.find();

  const academicPeriods: AcademicPeriod[] = [];

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

  await academicPeriodRepository.save(academicPeriods);
  logger.log('Academic periods created');
}
