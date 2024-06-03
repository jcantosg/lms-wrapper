import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { DataSource, Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';

export class CreateTitleE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-create-title@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'create-title@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();

  public static businessUnitId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';

  public static newTitleId = 'd66ffa3e-22e4-48ca-aeea-0c3b37fc70c3';
  public static titleName = 'Desarrollo de Aplicaciones Multiplataforma';
  public static titleOfficialCode = 'DAM';
  public static titleOfficialProgram = 'BOE-231';
  public static titleOfficialTitle =
    'Desarrollo de Aplicaciones Multiplataforma';

  public static existingTitleId = '720d2d75-baea-4705-b926-6f004bf26192';

  private businessUnit: BusinessUnit;
  private superAdminUser: AdminUser;
  private adminUser: AdminUser;

  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private titleRepository: Repository<Title>;

  constructor(private datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.titleRepository = datasource.getRepository(titleSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });
    this.businessUnit = BusinessUnit.create(
      CreateTitleE2eSeed.businessUnitId,
      CreateTitleE2eSeed.businessUnitName,
      CreateTitleE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);
    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateTitleE2eSeed.superAdminUserId,
      CreateTitleE2eSeed.superAdminUserEmail,
      CreateTitleE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      CreateTitleE2eSeed.adminUserId,
      CreateTitleE2eSeed.adminUserEmail,
      CreateTitleE2eSeed.adminUserPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );

    await this.titleRepository.save(
      Title.create(
        CreateTitleE2eSeed.existingTitleId,
        'name',
        'code',
        'title',
        'program',
        this.businessUnit,
        this.superAdminUser,
      ),
    );
  }

  async clear(): Promise<void> {
    await this.titleRepository.delete(CreateTitleE2eSeed.newTitleId);
    await this.titleRepository.delete(CreateTitleE2eSeed.existingTitleId);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
