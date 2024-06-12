import { v4 as uuid } from 'uuid';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { VirtualCampusNotFoundException } from '#shared/domain/exception/business-unit/virtual-campus/virtual-campus-not-found.exception';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { TransferAcademicRecordCommand } from '#student/application/academic-record/transfer-academic-record/transfer-academic-record.command';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { TransactionalService } from '#shared/domain/service/transactional-service.service';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { AcademicRecordTransfer } from '#student/domain/entity/academic-record-transfer.entity';
import { EnrollmentCreator } from '#student/domain/service/enrollment-creator.service';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { AcademicProgramNotIncludedInAcademicPeriodException } from '#shared/domain/exception/academic-offering/academic-program.not-included-in-academic-period.exception';

export class TransferAcademicRecordHandler implements CommandHandler {
  constructor(
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly virtualCampusGetter: VirtualCampusGetter,
    private readonly academicPeriodGetter: AcademicPeriodGetter,
    private readonly academicProgramGetter: AcademicProgramGetter,
    private readonly transactionalService: TransactionalService,
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly fileManager: FileManager,
    private readonly enrollmentCreatorService: EnrollmentCreator,
    private readonly enrollmentGetter: EnrollmentGetter,
  ) {}

  async handle(command: TransferAcademicRecordCommand) {
    const oldAcademicRecord = await this.academicRecordGetter.getByAdminUser(
      command.oldAcademicRecordId,
      command.adminUser,
    );

    const businessUnit = await this.businessUnitGetter.getByAdminUser(
      command.businessUnitId,
      command.adminUser.businessUnits.map((bu) => bu.id),
    );
    const virtualCampus = await this.virtualCampusGetter.get(
      command.virtualCampusId,
    );
    if (virtualCampus.businessUnit.id !== businessUnit.id) {
      throw new VirtualCampusNotFoundException();
    }
    const academicPeriod = await this.academicPeriodGetter.getByAdminUser(
      command.academicPeriodId,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const academicProgram = await this.academicProgramGetter.getByAdminUser(
      command.academicProgramId,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    if (academicProgram.businessUnit.id !== businessUnit.id) {
      throw new AcademicProgramNotFoundException();
    }

    if (
      academicPeriod.businessUnit.id !== businessUnit.id ||
      !academicPeriod.academicPrograms
        .map((program) => program.id)
        .includes(command.academicProgramId)
    ) {
      throw new AcademicProgramNotIncludedInAcademicPeriodException();
    }

    oldAcademicRecord.updateStatus(
      AcademicRecordStatusEnum.CANCELLED,
      command.adminUser,
    );

    const newAcademicRecord = AcademicRecord.create(
      command.newAcademicRecordId,
      businessUnit,
      virtualCampus,
      oldAcademicRecord.student,
      academicPeriod,
      academicProgram,
      command.modality,
      command.isModular,
      command.adminUser,
    );

    const fileURLs: string[] = [];
    await Promise.all([
      command.files.forEach(async (file) =>
        fileURLs.push(await this.fileManager.uploadFile(file)),
      ),
    ]);

    const academicRecordTransfer = AcademicRecordTransfer.create(
      uuid(),
      command.adminUser,
      oldAcademicRecord,
      newAcademicRecord,
      command.comments,
      fileURLs,
    );

    const enrollments =
      await this.enrollmentCreatorService.createForAcademicRecord(
        newAcademicRecord,
      );

    const oldEnrollments =
      await this.enrollmentGetter.getByAcademicRecord(oldAcademicRecord);

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

    await this.transactionalService.execute({
      oldAcademicRecord,
      newAcademicRecord,
      academicRecordTransfer,
      enrollments,
    });
  }
}
