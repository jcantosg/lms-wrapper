import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectResourceRepository } from '#academic-offering/domain/repository/subject-resource.repository';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { SubjectResourceGetter } from '#academic-offering/domain/service/subject/subject-resource-getter.service';
import { DeleteSubjectResourceCommand } from '#academic-offering/applicaton/subject/delete-subject-resource/delete-subject-resource.command';

export class DeleteSubjectResourceHandler implements CommandHandler {
  constructor(
    private readonly repository: SubjectResourceRepository,
    private readonly subjectGetter: SubjectGetter,
    private readonly subjectResourceGetter: SubjectResourceGetter,
    private readonly fileManager: FileManager,
  ) {}

  async handle(command: DeleteSubjectResourceCommand): Promise<void> {
    await this.subjectGetter.getByAdminUser(
      command.subjectId,
      command.adminUser.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const subjectResource = await this.subjectResourceGetter.get(
      command.resourceId,
    );

    await this.fileManager.deleteFile(subjectResource.url);

    await this.repository.delete(subjectResource.id);
  }
}
