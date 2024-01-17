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
import { GetAllBusinessUnitsE2eSeedDataConfig } from '#test/e2e/sga/business-unit/seed-data-config/get-all-business-units.e2e-seed-data-config';

export class DeleteExaminationCenterE2eSeeds implements E2eSeed {
  public static examinationCenterId = '1c63d7a9-c0f4-4a5e-9e76-c6ce6f904dd1';
  public static examinationCenterName = 'Name';
  public static examinationCenterCode = 'NAM01';
  public static examinationCenterAddress = 'address';

  public static mainExaminationCenterId =
    'dd686ce4-42be-4ab1-af6b-87400397f672';

  public static mainExaminationCenterName = 'Main';
  public static mainExaminationCenterCode = 'MAI01';
  public static mainExaminationCenterAddress = 'main address';

  private superAdminUser: AdminUser;

  private examinationCenterRepository: Repository<ExaminationCenter>;
  private examinationCenter: ExaminationCenter;
  private mainExaminationCenter: ExaminationCenter;

  constructor(private readonly datasource: DataSource) {
    this.examinationCenterRepository = datasource.getRepository(
      examinationCenterSchema,
    );
  }

  async arrange(): Promise<void> {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.userId,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.email,
      GetAllBusinessUnitsE2eSeedDataConfig.superAdmin.password,
      [AdminUserRoles.SUPERADMIN],
    );
    this.examinationCenter = ExaminationCenter.create(
      DeleteExaminationCenterE2eSeeds.examinationCenterId,
      DeleteExaminationCenterE2eSeeds.examinationCenterName,
      DeleteExaminationCenterE2eSeeds.examinationCenterCode,
      [],
      DeleteExaminationCenterE2eSeeds.examinationCenterAddress,
      this.superAdminUser,
    );
    this.mainExaminationCenter = ExaminationCenter.create(
      DeleteExaminationCenterE2eSeeds.mainExaminationCenterId,
      DeleteExaminationCenterE2eSeeds.mainExaminationCenterName,
      DeleteExaminationCenterE2eSeeds.mainExaminationCenterCode,
      [],
      DeleteExaminationCenterE2eSeeds.mainExaminationCenterAddress,
      this.superAdminUser,
    );
    this.mainExaminationCenter.isMain = true;
    await this.examinationCenterRepository.save(this.examinationCenter);
    await this.examinationCenterRepository.save(this.mainExaminationCenter);
  }

  async clear(): Promise<void> {
    await this.examinationCenterRepository.delete({
      id: DeleteExaminationCenterE2eSeeds.examinationCenterId,
    });
    await this.examinationCenterRepository.delete({
      id: DeleteExaminationCenterE2eSeeds.mainExaminationCenterId,
    });
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
