import { DataSource } from 'typeorm';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { Country } from '#shared/domain/entity/country.entity';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';

export class RemoveBusinessUnitsFromEdaeUserE2eSeeds implements E2eSeed {
  public static superAdminUserEmail =
    'super-add-business-units-to-edae-user@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = '7dd458fc-3172-47bc-9b39-eab9b7ae8397';

  public static adminUserEmail = 'add-business-units-to-edae-user@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = '25e42a6f-6979-4ac6-b332-e884afb17b23';

  public static countryId = '3a98c9f1-9a7d-4b35-9cdc-ecc6e019834e';

  public static businessUnitId = 'a5aa93ba-374b-4c5d-b538-87f7553b6cfe';
  public static businessUnitName = 'Cartagena';
  public static businessUnitCode = 'CAR';

  public static anotherBusinessUnitId = '28b5f2a2-d8a0-4517-98ca-a7135bb01875';
  public static anotherBusinessUnitName = 'Murcia';
  public static anotherBusinessUnitCode = 'MUR';

  public static originalEdaeUserBusinessUnitId =
    '4c8a0cfa-4974-49ff-a82d-c7e423b99fb2';
  public static originalEdaeUserBusinessUnitName = 'Badajoz';
  public static originalEdaeUserBusinessUnitCode = 'BAD';

  public static edaeUserId = '02096887-c100-4170-b470-1230b90bcbc4';

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private country: Country;
  private businessUnit: BusinessUnit;
  private originalBusinessUnit: BusinessUnit;
  private edaeUser: EdaeUser;

  private readonly businessUnitRepository;
  private readonly countryRepository;
  private readonly edaeUserRepository;
  private readonly adminUserRepository;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.edaeUserRepository = datasource.getRepository(edaeUserSchema);
    this.adminUserRepository = datasource.getRepository(adminUserSchema);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      RemoveBusinessUnitsFromEdaeUserE2eSeeds.adminUserId,
      RemoveBusinessUnitsFromEdaeUserE2eSeeds.adminUserEmail,
      RemoveBusinessUnitsFromEdaeUserE2eSeeds.adminUserPassword,
      [],
    );

    this.superAdminUser = await createAdminUser(
      this.datasource,
      RemoveBusinessUnitsFromEdaeUserE2eSeeds.superAdminUserId,
      RemoveBusinessUnitsFromEdaeUserE2eSeeds.superAdminUserEmail,
      RemoveBusinessUnitsFromEdaeUserE2eSeeds.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = await this.countryRepository.save(
      Country.create(
        RemoveBusinessUnitsFromEdaeUserE2eSeeds.countryId,
        'ZZ',
        'ZZZ',
        'Test Country',
        '+99',
        'emoji',
      ),
    );

    this.businessUnit = await this.businessUnitRepository.save(
      BusinessUnit.create(
        RemoveBusinessUnitsFromEdaeUserE2eSeeds.businessUnitId,
        RemoveBusinessUnitsFromEdaeUserE2eSeeds.businessUnitName,
        RemoveBusinessUnitsFromEdaeUserE2eSeeds.businessUnitCode,
        this.country,
        this.superAdminUser,
      ),
    );
    await this.businessUnitRepository.save(
      BusinessUnit.create(
        RemoveBusinessUnitsFromEdaeUserE2eSeeds.anotherBusinessUnitId,
        RemoveBusinessUnitsFromEdaeUserE2eSeeds.anotherBusinessUnitName,
        RemoveBusinessUnitsFromEdaeUserE2eSeeds.anotherBusinessUnitCode,
        this.country,
        this.adminUser,
      ),
    );

    this.originalBusinessUnit = await this.businessUnitRepository.save(
      BusinessUnit.create(
        RemoveBusinessUnitsFromEdaeUserE2eSeeds.originalEdaeUserBusinessUnitId,
        RemoveBusinessUnitsFromEdaeUserE2eSeeds.originalEdaeUserBusinessUnitName,
        RemoveBusinessUnitsFromEdaeUserE2eSeeds.originalEdaeUserBusinessUnitCode,
        this.country,
        this.adminUser,
      ),
    );

    this.superAdminUser.addBusinessUnit(this.businessUnit);

    await this.adminUserRepository.save({
      id: this.superAdminUser.id,
      businessUnits: this.superAdminUser.businessUnits,
    });

    this.edaeUser = EdaeUser.create(
      RemoveBusinessUnitsFromEdaeUserE2eSeeds.edaeUserId,
      'name',
      'apellido1',
      'apellido2',
      'email@gmail.com',
      new IdentityDocument({
        identityDocumentType: IdentityDocumentType.DNI,
        identityDocumentNumber: '74700994F',
      }),
      [EdaeRoles.RESPONSABLE_TUTOR],
      [this.originalBusinessUnit],
      TimeZoneEnum.GMT_PLUS_1,
      false,
      this.country,
      '',
      'password',
    );

    await this.edaeUserRepository.save(this.edaeUser);
  }

  async clear(): Promise<void> {
    await this.edaeUserRepository.delete({
      id: this.edaeUser.id,
    });

    await this.businessUnitRepository.delete({
      id: this.businessUnit.id,
    });
    await this.businessUnitRepository.delete({
      id: this.originalBusinessUnit.id,
    });
    await this.businessUnitRepository.delete({
      id: RemoveBusinessUnitsFromEdaeUserE2eSeeds.anotherBusinessUnitId,
    });

    await this.countryRepository.delete({ id: this.country.id });
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }

  async addBusinessUnitToEdaeUser(): Promise<void> {
    await this.edaeUserRepository.save({
      id: this.edaeUser.id,
      businessUnits: [...this.edaeUser.businessUnits, this.businessUnit],
    });
  }
}
