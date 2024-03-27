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
import { String } from 'aws-sdk/clients/cloudsearchdomain';

export class GetTitleDetailE2ESeed implements E2eSeed {
  private superAdminUser: AdminUser;
  private title: Title;
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

  public static titleId: String = '005e42d4-aa2f-4012-a4e9-58af03bafb86';
  public static titleName: String = 'Ingeniería de Sistemas';
  public static titleOfficialCode: String = 'IS-001';
  public static titleOfficialTitle: String = 'Ingeniero de Sistemas';
  public static titleOfficialProgram: String = 'Ingeniería';

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
      GetTitleDetailE2ESeed.countryId,
      'mercurio',
      'GGZ',
      'Mercurio',
      '988',
      ':D',
    );
    await this.countryRepository.save(this.country);

    this.businessUnit = BusinessUnit.create(
      GetTitleDetailE2ESeed.businessUnitId,
      GetTitleDetailE2ESeed.businessUnitName,
      GetTitleDetailE2ESeed.businessUnitCode,
      this.country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetTitleDetailE2ESeed.superAdminUserId,
      GetTitleDetailE2ESeed.superAdminUserMail,
      GetTitleDetailE2ESeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    (this.title = Title.create(
      GetTitleDetailE2ESeed.titleId,
      GetTitleDetailE2ESeed.titleName,
      GetTitleDetailE2ESeed.titleOfficialCode,
      GetTitleDetailE2ESeed.titleOfficialTitle,
      GetTitleDetailE2ESeed.titleOfficialProgram,
      this.businessUnit,
      this.superAdminUser,
    )),
      await this.titleRepository.save(this.title);
  }

  async clear(): Promise<void> {
    await this.titleRepository.delete(GetTitleDetailE2ESeed.titleId);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await this.countryRepository.delete(this.country.id);
  }
}
