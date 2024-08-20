import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { DataSource, Repository } from 'typeorm';
import { EdaeUserRefreshToken } from '#/teacher/domain/entity/edae-user-refresh-token.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { edaeUserRefreshTokenSchema } from '#/teacher/infrastructure/config/schema/edae-user-refresh-token.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { createEdaeUser } from '#test/e2e/teacher/e2e-auth-helper';

export class TeacherMeE2eSeed implements E2eSeed {
  public static edaeId = uuid();
  public static edaeEmail = 'edae-user@email.com';
  public static edaeName = 'edae-user';
  public static edaeSurname1 = 'edae-user-surname1';
  public static edaePassword = 'pass123';
  public static edaeRole = EdaeRoles.DOCENTE;

  public static superAdminUserEmail = 'superadmin@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();

  public static businessUnitId = uuid();
  public static businessUnitName = 'Madrid';
  public static businessUnitCode = 'MAD';

  private edaeUser: EdaeUser;
  private businessUnit: BusinessUnit;
  private superAdminUser: AdminUser;

  private readonly codeRepository: Repository<EdaeUserRefreshToken>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private countryRepository: Repository<Country>;
  private edaeUserRepository: Repository<EdaeUser>;

  constructor(private readonly datasource: DataSource) {
    this.codeRepository = datasource.getRepository(edaeUserRefreshTokenSchema);
    this.businessUnitRepository = datasource.getRepository(businessUnitSchema);
    this.countryRepository = datasource.getRepository(CountrySchema);
    this.edaeUserRepository = datasource.getRepository(edaeUserSchema);
  }

  async arrange(): Promise<void> {
    const country = await this.countryRepository.findOneByOrFail({
      name: 'España',
    });

    this.businessUnit = BusinessUnit.create(
      TeacherMeE2eSeed.businessUnitId,
      TeacherMeE2eSeed.businessUnitName,
      TeacherMeE2eSeed.businessUnitCode,
      country,
      this.superAdminUser,
    );
    await this.businessUnitRepository.save(this.businessUnit);

    this.superAdminUser = await createAdminUser(
      this.datasource,
      TeacherMeE2eSeed.superAdminUserId,
      TeacherMeE2eSeed.superAdminUserEmail,
      TeacherMeE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
      [this.businessUnit],
    );

    this.edaeUser = await createEdaeUser(
      this.datasource,
      TeacherMeE2eSeed.edaeId,
      TeacherMeE2eSeed.edaeName,
      TeacherMeE2eSeed.edaeSurname1,
      TeacherMeE2eSeed.edaeEmail,
      TeacherMeE2eSeed.edaePassword,
      [TeacherMeE2eSeed.edaeRole],
      [this.businessUnit],
      country,
    );
  }

  async clear() {
    await this.codeRepository.delete({ user: { id: this.edaeUser.id } });
    await this.edaeUserRepository.delete(this.edaeUser.id);
    await this.businessUnitRepository.delete(this.businessUnit.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
