import { Repository, DataSource } from 'typeorm';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Country } from '#shared/domain/entity/country.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class GetAllTitlesE2eSeed implements E2eSeed {
  private superAdminUser: AdminUser;
  private titles: Title[];
  private country: Country;
  private businessUnit: BusinessUnit;

  public static superAdminUserMail: string =
    'SuperAdminUserTestMail@universae.com';
  public static superAdminUserId: string =
    'd506b063-f57d-4e47-a91e-a83e06762741';
  public static superAdminUserPassword: string = 'test1234';

  public static countryId = '34bf728e-745a-4a0e-9235-80627fb225dc';

  public static businessUnitId: string = '5a97489a-c46d-4ea0-89e9-b382c1ab60ff';
  public static businessUnitName: string = 'Shanghai';
  public static businessUnitCode: string = 'SH01';

  public static arrayTitles = [
    {
      id: '005e42d4-aa2f-4012-a4e9-58af03bafb86',
      name: 'Ingeniería de Sistemas',
      officialCode: 'IS-001',
      officialTitle: 'Ingeniero de Sistemas',
      officialProgram: 'Ingeniería',
    },
    {
      id: '98c4eeec-344d-4c5f-81f0-f8e76d50bb3a',
      name: 'Administración de Empresas',
      officialCode: 'AE-002',
      officialTitle: 'Administrador de Empresas',
      officialProgram: 'Administración',
    },
  ];

  private readonly businessUnitRepository: Repository<BusinessUnit>;
  private readonly countryRepository: Repository<Country>;
  private readonly titleRepository: Repository<Title>;

  constructor(private readonly datasource: DataSource) {
    this.businessUnitRepository = datasource.getRepository(BusinessUnit);
    this.countryRepository = datasource.getRepository(Country);
    this.titleRepository = datasource.getRepository(Title);
  }

  async arrange(): Promise<void> {
    this.country = Country.create(
      GetAllTitlesE2eSeed.countryId,
      'mercurio',
      'GGZ',
      'Mercurio',
      '988',
      ':D',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      GetAllTitlesE2eSeed.businessUnitId,
      GetAllTitlesE2eSeed.businessUnitName,
      GetAllTitlesE2eSeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAllTitlesE2eSeed.superAdminUserId,
      GetAllTitlesE2eSeed.superAdminUserMail,
      GetAllTitlesE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.titles = await Promise.all(
      GetAllTitlesE2eSeed.arrayTitles.map(async (title) =>
        Title.create(
          title.id,
          title.name,
          title.officialCode,
          title.officialTitle,
          title.officialProgram,
          this.businessUnit,
          this.superAdminUser,
        ),
      ),
    );
    await this.titleRepository.save(this.titles);
  }

  async clear(): Promise<void> {
    const titlesIds = this.titles.map((title) => title.id);
    await this.titleRepository.delete(titlesIds);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await this.countryRepository.delete(this.country.id);
  }
}
