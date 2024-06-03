import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';

export class DeleteTitleE2eSeed implements E2eSeed {
  public static titleId = 'ad1b657b-c378-4b55-a97f-d5050856ea64';

  public static superAdminUserEmail = 'super-delete-title@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'delete-title@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';

  private businessUnit: BusinessUnit;
  private superAdminUser: AdminUser;
  private adminUser: AdminUser;

  private titleRepository: Repository<Title>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;

  constructor(private readonly datasource: DataSource) {
    this.titleRepository = datasource.getRepository(titleSchema);
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneOrFail({
      where: { name: 'España' },
    });
    this.businessUnit = BusinessUnit.create(
      DeleteTitleE2eSeed.businessUnitId,
      DeleteTitleE2eSeed.businessUnitName,
      DeleteTitleE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    this.superAdminUser = await createAdminUser(
      this.datasource,
      DeleteTitleE2eSeed.superAdminUserId,
      DeleteTitleE2eSeed.superAdminUserEmail,
      DeleteTitleE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      DeleteTitleE2eSeed.adminUserId,
      DeleteTitleE2eSeed.adminUserEmail,
      DeleteTitleE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );

    await this.titleRepository.save(
      Title.create(
        DeleteTitleE2eSeed.titleId,
        'name',
        'officialCode',
        'officialTitle',
        'officialProgram',
        this.businessUnit,
        this.superAdminUser,
      ),
    );
  }

  async clear(): Promise<void> {
    await this.titleRepository.delete(DeleteTitleE2eSeed.titleId);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
