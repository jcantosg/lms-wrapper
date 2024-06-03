import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { classroomSchema } from '#business-unit/infrastructure/config/schema/classroom.schema';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';

export class DeleteClassroomE2eSeed implements E2eSeed {
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
  public static classroomId = '64c10071-d619-470f-a4e1-ec2a75f91ad6';
  public static classroomName = 'Aula 01';
  public static classroomCode = 'A01';
  public static classroomCapacity = 65;
  public static countryId = '5736763a-507f-40ec-a4b0-d9e68f0a2ea7';

  private classroomRepository: Repository<Classroom>;
  private examinationCenterRepository: Repository<ExaminationCenter>;
  private countryRepository: Repository<Country>;
  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private examinationCenter: ExaminationCenter;
  private country: Country;
  private classroom: Classroom;

  constructor(private readonly datasource: DataSource) {
    this.classroomRepository = datasource.getRepository(classroomSchema);
    this.examinationCenterRepository = datasource.getRepository(
      examinationCenterSchema,
    );
    this.countryRepository = datasource.getRepository(CountrySchema);
  }

  async arrange() {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      DeleteClassroomE2eSeed.superAdminUserId,
      DeleteClassroomE2eSeed.superAdminUserEmail,
      DeleteClassroomE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      DeleteClassroomE2eSeed.adminUserId,
      DeleteClassroomE2eSeed.adminUserEmail,
      DeleteClassroomE2eSeed.adminUserPassword,
      [],
    );
    this.country = await this.countryRepository.save(
      Country.create(
        DeleteClassroomE2eSeed.countryId,
        'Nuevo Pais',
        'NUO',
        'Nuevo país',
        '+99',
        'emoji',
      ),
    );
    this.examinationCenter = ExaminationCenter.create(
      DeleteClassroomE2eSeed.examinationCenterId,
      DeleteClassroomE2eSeed.examinationCenterName,
      DeleteClassroomE2eSeed.examinationCenterCode,
      [],
      DeleteClassroomE2eSeed.examinationCenterAddress,
      this.superAdminUser,
      this.country,
    );
    await this.examinationCenterRepository.save(this.examinationCenter);

    this.classroom = Classroom.create(
      DeleteClassroomE2eSeed.classroomId,
      DeleteClassroomE2eSeed.classroomName,
      DeleteClassroomE2eSeed.classroomCode,
      DeleteClassroomE2eSeed.classroomCapacity,
      this.superAdminUser,
      this.examinationCenter,
    );
    await this.classroomRepository.save(this.classroom);
  }

  async clear() {
    await this.examinationCenterRepository.delete(this.examinationCenter.id);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
    await this.countryRepository.delete(this.country.id);
  }
}
