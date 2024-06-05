import datasource from '#config/ormconfig';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Logger } from '@nestjs/common';
import { titles as titlesRaw } from '#commands/title/titles';
import { Title } from '#academic-offering/domain/entity/title.entity';

export async function seedTitles(logger: Logger) {
  const titleRepository = datasource.getRepository(Title);
  const businessUnitRepository = datasource.getRepository(BusinessUnit);
  const adminUserRepository = datasource.getRepository(AdminUser);

  const adminSga = await adminUserRepository.findOne({
    where: { email: 'sga@universae.com' },
  });

  const businessUnit = await businessUnitRepository.findOne({
    where: { id: '68fc5295-d99d-432d-a989-433361974791' },
  });

  const titles: Title[] = [];

  titlesRaw.forEach((title) => {
    titles.push(
      Title.create(
        title.id,
        title.name,
        title.officialCode,
        title.officialTitle,
        title.officialProgram,
        businessUnit!,
        adminSga!,
      ),
    );
  });

  await titleRepository.save(titles);
  logger.log('Titles created');
}
