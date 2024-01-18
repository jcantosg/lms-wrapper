import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { DataSource, Repository } from 'typeorm';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class EditVirtualCampusE2eSeed implements E2eSeed {
  public static countryId = uuid();

  public static superAdminUserEmail = 'super-edit-virtual-campus@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static adminUserEmail = 'edit-virtual-campus@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static businessUnitId = '21c1fb84-ca89-4b20-a646-08dbf32cd06a';
  public static businessUnitCode = 'SEV';
  public static businessUnitName = 'Sevilla';

  public static virtualCampusId = '1847be5e-693f-4a7d-9f66-00faed159c0c';
  public static existingVirtualCampusId =
    '77111c4d-1ea6-4bb0-bc97-99836e809f15';
  public static virtualCampusName = 'Madrid';
  public static virtualCampusCode = 'MAD';

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private businessUnit: BusinessUnit;
  private virtualCampus: VirtualCampus;
  private existingVirtualCampus: VirtualCampus;
  private country: Country;

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly virtualCampusRepository: Repository<VirtualCampus>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.virtualCampusRepository =
      datasource.getRepository(virtualCampusSchema);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      EditVirtualCampusE2eSeed.adminUserId,
      EditVirtualCampusE2eSeed.adminUserEmail,
      EditVirtualCampusE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      EditVirtualCampusE2eSeed.superAdminUserId,
      EditVirtualCampusE2eSeed.superAdminUserEmail,
      EditVirtualCampusE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );

    this.country = Country.create(
      EditVirtualCampusE2eSeed.countryId,
      'TESE',
      'TESTEdit',
      'TestEdit',
      '+999',
      '🏳️Edit',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      EditVirtualCampusE2eSeed.businessUnitId,
      EditVirtualCampusE2eSeed.businessUnitName,
      EditVirtualCampusE2eSeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );

    await this.businessUnitRepository.save(this.businessUnit);

    this.virtualCampus = VirtualCampus.createFromBusinessUnit(
      EditVirtualCampusE2eSeed.virtualCampusId,
      this.businessUnit,
      this.superAdminUser,
    );
    this.existingVirtualCampus = VirtualCampus.create(
      EditVirtualCampusE2eSeed.existingVirtualCampusId,
      EditVirtualCampusE2eSeed.virtualCampusName,
      EditVirtualCampusE2eSeed.virtualCampusCode,
      this.businessUnit,
      this.superAdminUser,
    );

    await this.virtualCampusRepository.save(this.virtualCampus);
    await this.virtualCampusRepository.save(this.existingVirtualCampus);
  }

  async clear() {
    await this.virtualCampusRepository.delete(this.virtualCampus.id);
    await this.virtualCampusRepository.delete(this.existingVirtualCampus.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.countryRepository.delete(this.country.id);
    await removeAdminUser(this.datasource, this.adminUser);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
