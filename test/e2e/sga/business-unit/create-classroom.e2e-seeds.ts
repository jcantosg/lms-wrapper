import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Country } from '#shared/domain/entity/country.entity';

export class CreateClassroomE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-create-classroom@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = 'eb542dfe-0b4c-464d-8d7c-82c3a75612ff';
  public static adminUserEmail = 'create-classroom@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = '089585c3-3cc9-4d85-9e27-b733cf4100b2';

  public static examinationCenterId = '617e256b-e6ac-4748-b07f-77c07528f77d';
  public static examinationCenterName = 'Centro Juan de la Cierva';
  public static examinationCenterCode = 'JUANCI';
  public static examinationCenterAddress = 'Calle Gines de los Rios';

  public static countryId = '5736763a-507f-40ec-a4b0-d9e68f0a2ea7';

  public static missingExaminationCenterId =
    '98f951ba-09ad-4f68-be0e-5bb8f71ffc80';

  public static classroomId = '64c10071-d619-470f-a4e1-ec2a75f91ad6';
  public static classroomName = 'Aula 01';
  public static classroomCode = 'A01';
  public static classroomCapacity = 65;
  public static secondClassroomId = '24cb1eea-2ee6-46dc-aee6-e8e02928b384';

  private classroomRepository: Repository<Classroom>;
  private examinationCenterRepository: Repository<ExaminationCenter>;
  private countryRepository: Repository<Country>;
  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private examinationCenter: ExaminationCenter;
  private country: Country;

  constructor(private readonly datasource: DataSource) {
    this.classroomRepository = datasource.getRepository(Classroom);
    this.examinationCenterRepository =
      datasource.getRepository(ExaminationCenter);
    this.countryRepository = datasource.getRepository(Country);
  }

  async arrange(): Promise<void> {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateClassroomE2eSeed.superAdminUserId,
      CreateClassroomE2eSeed.superAdminUserEmail,
      CreateClassroomE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      CreateClassroomE2eSeed.adminUserId,
      CreateClassroomE2eSeed.adminUserEmail,
      CreateClassroomE2eSeed.adminUserPassword,
      [],
    );
    this.country = await this.countryRepository.save(
      Country.create(
        CreateClassroomE2eSeed.countryId,
        'Nuevo Pais',
        'NUO',
        'Nuevo país',
        '+99',
        'emoji',
      ),
    );
    this.examinationCenter = ExaminationCenter.create(
      CreateClassroomE2eSeed.examinationCenterId,
      CreateClassroomE2eSeed.examinationCenterName,
      CreateClassroomE2eSeed.examinationCenterCode,
      [],
      CreateClassroomE2eSeed.examinationCenterAddress,
      this.superAdminUser,
      this.country,
    );
    await this.examinationCenterRepository.save(this.examinationCenter);
  }

  async clear(): Promise<void> {
    await this.classroomRepository.delete(CreateClassroomE2eSeed.classroomId);
    await this.examinationCenterRepository.delete(this.examinationCenter.id);
    await this.countryRepository.delete(this.country.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
