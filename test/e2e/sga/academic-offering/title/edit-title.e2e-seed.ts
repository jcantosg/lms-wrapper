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
import { E2eSeed } from '#test/e2e/e2e-seed';

export class EditTitleE2eSeed implements E2eSeed {
  public static titleId = 'fb5fa446-e98b-48fa-a00f-0dff382cecad';
  public static titleName = 'Title 1';
  public static titleOfficialCode = 'OC1';

  public static secondTitleId = uuid();
  public static secondTitleName = 'Title 2';
  public static secondTitleOfficialCode = 'OC2';

  public static superAdminUserEmail = 'super-edit-title@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserGestor360Email = 'edit-title@email.com';
  public static adminUserGestor360Password = 'pass123';
  public static adminUserGestor360Id = uuid();
  public static adminUserSecretariaId = uuid();
  public static adminUserSecretariaEmail = 'secretaria@universae.com';
  public static adminUserSecretariaPassword = 'pass123';

  public static businessUnitId = uuid();
  public static businessUnitName = 'Murcia';
  public static businessUnitCode = 'MUR';
  public static businessUnitId2 = uuid();
  public static businessUnitName2 = 'Madrid';
  public static businessUnitCode2 = 'MAD';

  private title: Title;
  private secondTitle: Title;
  private businessUnit: BusinessUnit;
  private secondBusinessUnit: BusinessUnit;
  private superAdminUser: AdminUser;
  private gestor360User: AdminUser;
  private secretaryUser: AdminUser;

  private titleRepository: Repository<Title>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;

  constructor(private dataSource: DataSource) {
    this.businessUnitRepository = dataSource.getRepository(BusinessUnit);
    this.countryRepository = dataSource.getRepository(Country);
    this.titleRepository = dataSource.getRepository(Title);
  }
  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      EditTitleE2eSeed.businessUnitId,
      EditTitleE2eSeed.businessUnitName,
      EditTitleE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.secondBusinessUnit = BusinessUnit.create(
      EditTitleE2eSeed.businessUnitId2,
      EditTitleE2eSeed.businessUnitName2,
      EditTitleE2eSeed.businessUnitCode2,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.secondBusinessUnit);

    this.superAdminUser = await createAdminUser(
      this.dataSource,
      EditTitleE2eSeed.superAdminUserId,
      EditTitleE2eSeed.superAdminUserEmail,
      EditTitleE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit, this.secondBusinessUnit],
    );

    this.gestor360User = await createAdminUser(
      this.dataSource,
      EditTitleE2eSeed.adminUserGestor360Id,
      EditTitleE2eSeed.adminUserGestor360Email,
      EditTitleE2eSeed.adminUserGestor360Password,
      [AdminUserRoles.GESTOR_360],
      [this.secondBusinessUnit],
    );

    this.secretaryUser = await createAdminUser(
      this.dataSource,
      EditTitleE2eSeed.adminUserSecretariaId,
      EditTitleE2eSeed.adminUserSecretariaEmail,
      EditTitleE2eSeed.adminUserSecretariaPassword,
      [AdminUserRoles.SECRETARIA],
      [this.businessUnit],
    );

    this.title = Title.create(
      EditTitleE2eSeed.titleId,
      EditTitleE2eSeed.titleName,
      EditTitleE2eSeed.titleOfficialCode,
      'Official Title',
      'Official Program',
      this.businessUnit,
      this.superAdminUser,
    );

    await this.titleRepository.save(this.title);

    this.secondTitle = Title.create(
      EditTitleE2eSeed.secondTitleId,
      EditTitleE2eSeed.secondTitleName,
      EditTitleE2eSeed.secondTitleOfficialCode,
      'Official Title',
      'Official Program',
      this.secondBusinessUnit,
      this.superAdminUser,
    );

    await this.titleRepository.save(this.secondTitle);
  }

  async clear(): Promise<void> {
    await this.titleRepository.delete(this.title.id);
    await this.titleRepository.delete(this.secondTitle.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await this.businessUnitRepository.delete(this.secondBusinessUnit.id);
    await removeAdminUser(this.dataSource, this.superAdminUser);
    await removeAdminUser(this.dataSource, this.gestor360User);
    await removeAdminUser(this.dataSource, this.secretaryUser);
  }
}
