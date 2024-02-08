import { Repository, DataSource } from 'typeorm';
import { E2eSeed } from '#test/e2e/e2e-seed';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { Country } from '#shared/domain/entity/country.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';

export class EditClassroomE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-edit-classroom@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = '6a802698-7780-41de-a84e-3d9d1a8a7e92';
  public static adminUserEmail = 'edit-classroom@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = '64393e44-fc7b-4758-9f9c-07ea0ab06634';

  public static examinationCenterId = '321d3ce3-adf0-41cd-a775-265d84ba137d';
  public static examinationCenterName = 'Centro de Canarias';
  public static examinationCenterCode = 'CANARIAS';
  public static examinationCenterAddress = 'Calle Gines de los Rios';

  public static countryId = '5736763a-507f-40ec-a4b0-d9e68f0a2ea7';

  public static classroomId = 'c2fc03f3-676c-4591-b815-e762d0e54542';
  public static classroomName = 'Aula 01';
  public static classroomCode = 'A01';
  public static classroomCapacity = 100;
  public static secondClassroomId = '093c8098-bf3b-459d-91ec-2aec366c352e';
  public static secondClassroomName = 'Aula 02';
  public static secondClassRoomCode = 'A02';

  public static missingExaminationCenterId =
    '89014897-54e2-4620-9244-3b56f160f4ec';

  private classroomRepository: Repository<Classroom>;
  private examinationCenterRepository: Repository<ExaminationCenter>;
  private countryRepository: Repository<Country>;

  private superAdminUser: AdminUser;
  private adminUser: AdminUser;
  private examinationCenter: ExaminationCenter;
  private firstClassroom: Classroom;
  private secondClassroom: Classroom;
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
      EditClassroomE2eSeed.superAdminUserId,
      EditClassroomE2eSeed.superAdminUserEmail,
      EditClassroomE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      EditClassroomE2eSeed.adminUserId,
      EditClassroomE2eSeed.adminUserEmail,
      EditClassroomE2eSeed.adminUserPassword,
      [],
    );

    this.country = await this.countryRepository.save(
      Country.create(
        EditClassroomE2eSeed.countryId,
        'PAISTEST',
        'NUO',
        'Nuevo país',
        '+99',
        'emoji',
      ),
    );

    this.examinationCenter = ExaminationCenter.create(
      EditClassroomE2eSeed.examinationCenterId,
      EditClassroomE2eSeed.examinationCenterName,
      EditClassroomE2eSeed.examinationCenterCode,
      [],
      EditClassroomE2eSeed.examinationCenterAddress,
      this.superAdminUser,
      this.country,
    );

    await this.examinationCenterRepository.save(this.examinationCenter);

    this.firstClassroom = Classroom.create(
      EditClassroomE2eSeed.classroomId,
      EditClassroomE2eSeed.classroomCode,
      EditClassroomE2eSeed.classroomName,
      EditClassroomE2eSeed.classroomCapacity,
      this.adminUser,
      this.examinationCenter,
    );

    this.secondClassroom = Classroom.create(
      EditClassroomE2eSeed.secondClassroomId,
      EditClassroomE2eSeed.secondClassRoomCode,
      EditClassroomE2eSeed.secondClassroomName,
      EditClassroomE2eSeed.classroomCapacity,
      this.adminUser,
      this.examinationCenter,
    );

    await this.classroomRepository.save([
      this.firstClassroom,
      this.secondClassroom,
    ]);
  }
  async clear(): Promise<void> {
    await this.classroomRepository.delete([
      EditClassroomE2eSeed.classroomId,
      EditClassroomE2eSeed.secondClassroomId,
    ]);
    await this.examinationCenterRepository.delete(
      EditClassroomE2eSeed.examinationCenterId,
    );
    await this.countryRepository.delete(EditClassroomE2eSeed.countryId);
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
