import { Logger } from '@nestjs/common';
import datasource from '#config/ormconfig';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { edaeUsers as edaeUsersRaw } from './edae-users';
import { IdentityDocument } from '#/sga/shared/domain/value-object/identity-document';

export async function seedEdaeUsers(logger: Logger) {
  const businessUnitRepository = datasource.getRepository(BusinessUnit);
  const edaeUserRepository = datasource.getRepository(EdaeUser);
  const countryRepository = datasource.getRepository(Country);

  const allBusinessUnits = await businessUnitRepository.find();
  const allCountries = await countryRepository.find();

  const edaeUsers: EdaeUser[] = [];

  edaeUsersRaw.forEach((edaeUser) => {
    edaeUsers.push(
      EdaeUser.create(
        edaeUser.id,
        edaeUser.name,
        edaeUser.surname1,
        edaeUser.surname2,
        edaeUser.email,
        new IdentityDocument({
          identityDocumentType: edaeUser.identityDocument.type,
          identityDocumentNumber: edaeUser.identityDocument.value,
        }),
        edaeUser.roles,
        allBusinessUnits.filter((bu) =>
          edaeUser.businessUnits.includes(bu.code),
        ),
        edaeUser.timeZone,
        edaeUser.isRemote,
        allCountries.find((c) => c.iso === edaeUser.locationIso) as Country,
        edaeUser.avatar,
      ),
    );
  });

  await edaeUserRepository.save(edaeUsers);
  logger.log('Edae users created');
}
