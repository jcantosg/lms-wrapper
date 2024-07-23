import { v4 as uuid } from 'uuid';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { Student } from '#shared/domain/entity/student.entity';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { CreateStudentFromCRMCommand } from '#student/application/create-student-from-crm/create-student-from-crm.command';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { ImportData } from '#shared/infrastructure/service/exceljs-file-parser.service';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { CRMImportRepository } from '#shared/domain/repository/crm-import.repository';
import { CRMImportStatus } from '#shared/domain/enum/crm-import-status.enum';
import { CRMImportErrorMessage } from '#shared/domain/enum/crm-import-error-message.enum';
import { CRMImport } from '#shared/domain/entity/crm-import.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { IdentityDocumentType } from '#/sga/shared/domain/value-object/identity-document';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { EnrollmentCreator } from '#student/domain/service/enrollment-creator.service';
import { CreateStudentFromCRMTransactionalService } from '#student/domain/service/create-student-from-crm.transactional-service';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { UpdateInternalGroupsService } from '#student/domain/service/update-internal-groups.service';
import { UpdateAdministrativeGroupsService } from '#student/domain/service/update-administrative-groups.service';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { InternalGroupMemberAddedEvent } from '#student/domain/event/internal-group/internal-group-member-added.event';

export class CreateStudentFromCRMHandler implements CommandHandler {
  constructor(
    private readonly repository: StudentRepository,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly virtualCampusGetter: VirtualCampusGetter,
    private readonly academicPeriodGetter: AcademicPeriodGetter,
    private readonly academicProgramGetter: AcademicProgramGetter,
    private readonly crmImportRepository: CRMImportRepository,
    private readonly adminUserGetter: AdminUserGetter,
    private readonly adminUserEmail: string,
    private readonly countryGetter: CountryGetter,
    private readonly academicRecordRepository: AcademicRecordRepository,
    private readonly enrollmentCreator: EnrollmentCreator,
    private readonly createStudentFromCRMTransactionalService: CreateStudentFromCRMTransactionalService,
    private readonly enrollmentGetter: EnrollmentGetter,
    private readonly updateInternalGroupsService: UpdateInternalGroupsService,
    private readonly updateAdministrativeGroupsService: UpdateAdministrativeGroupsService,
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  async handle(command: CreateStudentFromCRMCommand): Promise<CRMImport> {
    const newStudentId: string = uuid();
    const importData: ImportData = command.crmImport.data!;
    let businessUnit: BusinessUnit;
    let virtualCampus: VirtualCampus;
    let academicPeriod: AcademicPeriod;
    let academicProgram: AcademicProgram;

    try {
      businessUnit = await this.businessUnitGetter.getByName(
        importData.businessUnitName,
      );
    } catch (e) {
      return await this.errorResponse(
        command.crmImport,
        CRMImportErrorMessage.BUSINESS_UNIT_NOT_FOUND,
      );
    }

    try {
      virtualCampus = await this.virtualCampusGetter.getByCode(
        importData.virtualCampusCode,
      );
    } catch (e) {
      return await this.errorResponse(
        command.crmImport,
        CRMImportErrorMessage.VIRTUAL_CAMPUS_NOT_FOUND,
      );
    }

    try {
      academicPeriod = await this.academicPeriodGetter.getByCode(
        importData.academicPeriodCode,
      );
    } catch (e) {
      return await this.errorResponse(
        command.crmImport,
        CRMImportErrorMessage.ACADEMIC_PERIOD_NOT_FOUND,
      );
    }

    try {
      academicProgram = await this.academicProgramGetter.getByCode(
        importData.academicProgramCode,
      );
    } catch (e) {
      return await this.errorResponse(
        command.crmImport,
        CRMImportErrorMessage.ACADEMIC_PROGRAM_NOT_FOUND,
      );
    }

    return await this.createStudent(
      newStudentId,
      command.crmImport,
      businessUnit,
      virtualCampus,
      academicPeriod,
      academicProgram,
    );
  }

  private async createStudent(
    id: string,
    crmImport: CRMImport,
    businessUnit: BusinessUnit,
    virtualCampus: VirtualCampus,
    academicPeriod: AcademicPeriod,
    academicProgram: AcademicProgram,
  ): Promise<CRMImport> {
    const data = crmImport.data!;
    let student = await this.repository.getByEmail(
      crmImport.data!.universaeEmail,
    );

    const adminUser = await this.adminUserGetter.getByEmail(
      this.adminUserEmail,
    );

    if (student) {
      student.update(
        student.name ?? data.name,
        student.surname ?? data.surname1,
        student.surname2 ?? data.surname2,
        student.email ?? data.personalEmail,
        student.universaeEmail ?? data.universaeEmail,
        true,
        adminUser,
        student.avatar,
        student.birthDate ?? data.birthDate,
        student.gender ?? data.gender,
        student.country ?? (await this.countryGetter.getByName(data.country)),
        student.citizenship,
        student.identityDocument?.value ?? data.documentNumber
          ? {
              identityDocumentType: IdentityDocumentType.DNI,
              identityDocumentNumber: data.documentNumber!,
            }
          : null,
        student.socialSecurityNumber ?? data.nuss,
        student.accessQualification,
        student.niaIdalu,
        student.phone ?? data.phone,
        student.contactCountry,
        student.state ?? data.province,
        student.city ?? data.city,
        student.address,
        student.guardianName,
        student.guardianSurname,
        student.guardianEmail,
        student.guardianPhone,
        student.lmsStudent,
        data.defense,
      );

      const academicRecords =
        await this.academicRecordRepository.getStudentAcademicRecords(
          student.id,
          adminUser.businessUnits.map((bu) => bu.id),
          adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
        );
      if (
        !academicRecords.some(
          (ar) =>
            ar.businessUnit.id === businessUnit.id &&
            ar.virtualCampus.id === virtualCampus.id &&
            ar.academicPeriod.id === academicPeriod.id &&
            ar.academicProgram.id === academicProgram.id &&
            [
              AcademicRecordStatusEnum.VALID,
              AcademicRecordStatusEnum.FINISHED,
            ].includes(ar.status),
        )
      ) {
        const newAcademicRecord = AcademicRecord.create(
          uuid(),
          businessUnit,
          virtualCampus,
          student,
          academicPeriod,
          academicProgram,
          data.modality,
          true,
          adminUser,
        );
        student.academicRecords.push(newAcademicRecord);
        const enrollments =
          await this.enrollmentCreator.createForAcademicRecord(
            newAcademicRecord,
            adminUser,
          );

        const oldEnrollments =
          await this.enrollmentGetter.getByStudent(student);

        enrollments.forEach((enrollment) => {
          const oldEnrollment = oldEnrollments.find(
            (oe) => oe.subject.officialCode === enrollment.subject.officialCode,
          );
          if (oldEnrollment) {
            enrollment.calls = oldEnrollment.calls;
            enrollment.visibility = oldEnrollment.visibility;
            enrollment.type = oldEnrollment.type;
          }
        });

        const administrativeGroups =
          await this.updateAdministrativeGroupsService.update(
            student,
            null,
            newAcademicRecord,
            adminUser,
          );

        const internalGroups = await this.updateInternalGroupsService.update(
          student,
          null,
          enrollments,
          academicPeriod,
          academicProgram,
          adminUser,
        );

        await this.createStudentFromCRMTransactionalService.execute({
          student,
          academicRecord: newAcademicRecord,
          enrollments,
          administrativeGroups,
          internalGroups,
        });

        internalGroups.map(async (group) => {
          await this.eventDispatcher.dispatch(
            new InternalGroupMemberAddedEvent(group),
          );
        });
      } else {
        await this.createStudentFromCRMTransactionalService.execute({
          student,
          academicRecord: null,
          enrollments: [],
          administrativeGroups: [],
          internalGroups: [],
        });
      }
    } else {
      student = Student.createFromCRM(
        id,
        data.name,
        data.surname1,
        data.surname2,
        data.personalEmail,
        await this.passwordEncoder.encodePassword(data.password),
        data.universaeEmail,
        data.contactId,
        data.birthDate,
        data.gender,
        await this.countryGetter.getByName(data.country),
        {
          identityDocumentType: IdentityDocumentType.DNI,
          identityDocumentNumber: data.documentNumber ?? '',
        },
        data.nuss,
        data.phone,
        data.province,
        data.city,
        adminUser,
        null,
        data.defense,
      );

      const newAcademicRecord = AcademicRecord.createFromCRM(
        uuid(),
        businessUnit,
        virtualCampus,
        student,
        academicPeriod,
        academicProgram,
        data.modality,
        true,
        adminUser,
        data.leadId,
      );

      const enrollments = await this.enrollmentCreator.createForAcademicRecord(
        newAcademicRecord,
        adminUser,
      );

      student.academicRecords.push(newAcademicRecord);

      const administrativeGroups =
        await this.updateAdministrativeGroupsService.update(
          student,
          null,
          newAcademicRecord,
          adminUser,
        );

      const internalGroups = await this.updateInternalGroupsService.update(
        student,
        null,
        enrollments,
        academicPeriod,
        academicProgram,
        adminUser,
      );

      await this.createStudentFromCRMTransactionalService.execute({
        student,
        academicRecord: newAcademicRecord,
        enrollments,
        administrativeGroups,
        internalGroups,
      });

      internalGroups.map(async (group) => {
        await this.eventDispatcher.dispatch(
          new InternalGroupMemberAddedEvent(group),
        );
      });
    }

    crmImport.update(
      CRMImportStatus.COMPLETED,
      crmImport.contactId,
      crmImport.leadId,
      crmImport.data,
      null,
    );

    this.crmImportRepository.save(crmImport);

    return crmImport;
  }

  private async errorResponse(
    importData: CRMImport,
    errorMessage: CRMImportErrorMessage,
  ): Promise<CRMImport> {
    importData.update(
      CRMImportStatus.IMPORT_ERROR,
      importData.contactId,
      importData.leadId,
      importData.data,
      errorMessage,
    );
    await this.crmImportRepository.save(importData);

    return importData;
  }
}
