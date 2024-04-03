import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectResourceRepository } from '#academic-offering/domain/repository/subject-resource.repository';
import {
  ResourceFile,
  UploadSubjectResourceCommand,
} from '#academic-offering/applicaton/upload-subject-resource/upload-subject-resource.command';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { SubjectResource } from '#academic-offering/domain/entity/subject-resource.entity';
import { SubjectGetter } from '#academic-offering/domain/service/subject-getter.service';
import { SubjectResourceDuplicatedException } from '#shared/domain/exception/academic-offering/subject-resource.duplicated.exception';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class UploadSubjectResourceHandler implements CommandHandler {
  constructor(
    private readonly repository: SubjectResourceRepository,
    private readonly subjectGetter: SubjectGetter,
    private readonly fileManager: FileManager,
  ) {}

  async handle(command: UploadSubjectResourceCommand): Promise<void> {
    command.resourceFiles.map(async (resourceFile: ResourceFile) => {
      if (await this.repository.existsById(resourceFile.id)) {
        throw new SubjectResourceDuplicatedException();
      }
    });

    const subject = await this.subjectGetter.getByAdminUser(
      command.subjectId,
      command.adminUser.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    for (const resourceFile of command.resourceFiles) {
      const file = resourceFile.file;
      const fileUrl = await this.fileManager.uploadFile(file);
      const subjectResource = SubjectResource.create(
        resourceFile.id,
        file.fileName,
        fileUrl,
        file.content.length,
        subject,
        command.adminUser,
      );

      await this.repository.save(subjectResource);
    }
  }
}
