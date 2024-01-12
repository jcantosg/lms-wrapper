import { v4 as uuid } from 'uuid';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class GetExaminationCenterE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-get-examination-center@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'get-examination-center@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();
  public static examinationCenterId = '35637f98-af93-456d-bde4-811ec48d4814';
  public static examinationCenterName = 'Murcia';
  public static examinationCenterCode = 'MUR';
  public static examinationCenterAddress = 'Avenida Principal Parcela 26';
  private adminUser: AdminUser;
  private superAdminUser: AdminUser;
  private examinationCenter: ExaminationCenter;
  private readonly examinationCenterRepository: Repository<ExaminationCenter>;

  constructor(private datasource: DataSource) {
    this.examinationCenterRepository = datasource.getRepository(
      examinationCenterSchema,
    );
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      GetExaminationCenterE2eSeed.adminUserId,
      GetExaminationCenterE2eSeed.adminUserEmail,
      GetExaminationCenterE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetExaminationCenterE2eSeed.superAdminUserId,
      GetExaminationCenterE2eSeed.superAdminUserEmail,
      GetExaminationCenterE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );
    this.examinationCenter = ExaminationCenter.create(
      GetExaminationCenterE2eSeed.examinationCenterId,
      GetExaminationCenterE2eSeed.examinationCenterName,
      GetExaminationCenterE2eSeed.examinationCenterCode,
      [],
      GetExaminationCenterE2eSeed.examinationCenterAddress,
      this.superAdminUser,
    );
    this.examinationCenterRepository.save(this.examinationCenter);
  }

  async clear(): Promise<void> {
    await this.examinationCenterRepository.delete(this.examinationCenter.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
